import { getJson } from 'serpapi';

export interface SerpApiStockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  peRatio?: number;
  marketCap?: string;
  earnings?: string;
  revenue?: string;
  lastUpdated: string;
}

export interface GoogleFinanceResponse {
  summary?: {
    price?: number;
    currency?: string;
    change?: number;
    change_percent?: number;
  };
  knowledge_graph?: {
    price?: number;
    currency?: string;
    change?: number;
    change_percent?: number;
    market_cap?: string;
    pe_ratio?: number;
    earnings?: string;
    revenue?: string;
  };
  financials?: {
    pe_ratio?: number;
    market_cap?: string;
    revenue?: string;
    net_income?: string;
  };
}

// Stock symbol mappings for Indian stocks
const STOCK_SYMBOL_MAPPINGS: { [key: string]: string } = {
  // Financial Sector
  'HDFCBANK.NS': 'HDFCBANK:NSE',
  'BAJFINANCE.NS': 'BAJFINANCE:NSE',
  'ICICIBANK.NS': 'ICICIBANK:NSE',
  'BAJAJ-AUTO.NS': 'BAJAJ-AUTO:NSE',
  'SAVANIFIN.NS': 'SAVANIFIN:NSE',
  
  // Tech Sector
  'AFFLE.NS': 'AFFLE:NSE',
  'LTIM.NS': 'LTIM:NSE',
  'KPITTECH.NS': 'KPITTECH:NSE',
  'TATATECH.NS': 'TATATECH:NSE',
  'BLSE.NS': 'BLSE:NSE',
  'TANLA.NS': 'TANLA:NSE',
  
  // Consumer
  'DMART.NS': 'DMART:NSE',
  'TATACONSUM.NS': 'TATACONSUM:NSE',
  'PIDILITE.NS': 'PIDILITE:NSE',
  
  // Power
  'TATAPOWER.NS': 'TATAPOWER:NSE',
  'KPIGREEN.NS': 'KPIGREEN:NSE',
  'SUZLON.NS': 'SUZLON:NSE',
  'GENSOL.NS': 'GENSOL:NSE',
  
  // Pipe Sector
  'HARIOMPIPE.NS': 'HARIOMPIPE:NSE',
  'ASTRAL.NS': 'ASTRAL:NSE',
  'POLYCAB.NS': 'POLYCAB:NSE',
  
  // Others
  'CLEANSCI.NS': 'CLEANSCI:NSE',
  'DEEPAKNTR.NS': 'DEEPAKNTR:NSE',
  'FINEORG.NS': 'FINEORG:NSE',
  'GRAVITA.NS': 'GRAVITA:NSE',
  'SBILIFE.NS': 'SBILIFE:NSE',
  'INFY.NS': 'INFY:NSE',
  'HAPPSTMNDS.NS': 'HAPPSTMNDS:NSE',
  'EASEMYTRIP.NS': 'EASEMYTRIP:NSE'
};

export class SerpApiClient {
  private apiKey: string;
  private cache: Map<string, { data: SerpApiStockData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 15000; // 15 seconds

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchStockData(symbol: string): Promise<SerpApiStockData | null> {
    // Check cache first
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const googleSymbol = STOCK_SYMBOL_MAPPINGS[symbol] || symbol;
      
      const response = await new Promise<GoogleFinanceResponse>((resolve, reject) => {
        getJson({
          engine: "google_finance",
          q: googleSymbol,
          api_key: this.apiKey
        }, (json: GoogleFinanceResponse) => {
          if (json) {
            resolve(json);
          } else {
            reject(new Error('No data received'));
          }
        });
      });

      const stockData = this.parseGoogleFinanceResponse(symbol, response);
      
      if (stockData) {
        // Cache the result
        this.cache.set(symbol, {
          data: stockData,
          timestamp: Date.now()
        });
      }

      return stockData;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  }

  async fetchMultipleStocks(symbols: string[]): Promise<Map<string, SerpApiStockData>> {
    const results = new Map<string, SerpApiStockData>();
    
    // Process stocks in batches to avoid rate limiting
    const batchSize = 3;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      
      const promises = batch.map(async (symbol) => {
        const data = await this.fetchStockData(symbol);
        if (data) {
          results.set(symbol, data);
        }
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
      });

      await Promise.all(promises);
      
      // Add delay between batches
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  private parseGoogleFinanceResponse(symbol: string, response: GoogleFinanceResponse): SerpApiStockData | null {
    try {
      // Try to get data from knowledge_graph first, then summary
      const data = response.knowledge_graph || response.summary;
      const financials = response.financials;

      if (!data) {
        return null;
      }

      const price = data.price || 0;
      const change = data.change || 0;
      const changePercent = data.change_percent || 0;

      return {
        symbol,
        price,
        change,
        changePercent,
        peRatio: financials?.pe_ratio || data.pe_ratio,
        marketCap: financials?.market_cap || data.market_cap,
        earnings: financials?.net_income || data.earnings,
        revenue: financials?.revenue || data.revenue,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error parsing response for ${symbol}:`, error);
      return null;
    }
  }

  // Get cached data for immediate response
  getCachedData(symbol: string): SerpApiStockData | null {
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION * 2) {
      return cached.data;
    }
    return null;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let serpApiClient: SerpApiClient | null = null;

export function getSerpApiClient(): SerpApiClient {
  if (!serpApiClient) {
    const apiKey = process.env.SERPAPI_KEY || 'demo_key';
    serpApiClient = new SerpApiClient(apiKey);
  }
  return serpApiClient;
}

// Enhanced fallback data with more realistic variations
export function getFallbackStockData(symbol: string): SerpApiStockData {
  const basePrices: { [key: string]: number } = {
    'HDFCBANK.NS': 1770,
    'BAJFINANCE.NS': 6500,
    'ICICIBANK.NS': 1200,
    'BAJAJ-AUTO.NS': 9500,
    'SAVANIFIN.NS': 180,
    'AFFLE.NS': 1200,
    'LTIM.NS': 5800,
    'KPITTECH.NS': 1800,
    'TATATECH.NS': 900,
    'BLSE.NS': 90,
    'TANLA.NS': 480,
    'DMART.NS': 3500,
    'TATACONSUM.NS': 850,
    'PIDILITE.NS': 2800,
    'TATAPOWER.NS': 350,
    'KPIGREEN.NS': 200,
    'SUZLON.NS': 45,
    'GENSOL.NS': 150,
    'HARIOMPIPE.NS': 250,
    'ASTRAL.NS': 2200,
    'POLYCAB.NS': 4500,
    'CLEANSCI.NS': 1650,
    'DEEPAKNTR.NS': 2650,
    'FINEORG.NS': 5200,
    'GRAVITA.NS': 1450,
    'SBILIFE.NS': 1580,
    'INFY.NS': 1450,
    'HAPPSTMNDS.NS': 920,
    'EASEMYTRIP.NS': 38
  };

  const basePrice = basePrices[symbol] || 1000;
  
  // Create more realistic price movements
  const volatility = 0.03; // 3% volatility
  const trend = (Math.random() - 0.5) * 0.02; // Small trend component
  const randomComponent = (Math.random() - 0.5) * volatility;
  
  const priceChange = basePrice * (trend + randomComponent);
  const newPrice = Math.max(basePrice + priceChange, basePrice * 0.5); // Prevent negative prices
  const change = newPrice - basePrice;
  const changePercent = (change / basePrice) * 100;

  // Generate realistic P/E ratios based on sector
  let peRatio = 15 + Math.random() * 25;
  if (symbol.includes('TECH') || symbol.includes('INFY') || symbol.includes('LTIM')) {
    peRatio = 20 + Math.random() * 15; // Tech stocks typically higher P/E
  } else if (symbol.includes('BANK') || symbol.includes('FINANCE')) {
    peRatio = 10 + Math.random() * 15; // Financial stocks typically lower P/E
  }

  return {
    symbol,
    price: Math.round(newPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    peRatio: Math.round(peRatio * 10) / 10,
    marketCap: `₹${(Math.random() * 100000 + 10000).toFixed(0)} Cr`,
    earnings: `₹${(Math.random() * 5000 + 500).toFixed(0)} Cr`,
    revenue: `₹${(Math.random() * 20000 + 2000).toFixed(0)} Cr`,
    lastUpdated: new Date().toISOString()
  };
}
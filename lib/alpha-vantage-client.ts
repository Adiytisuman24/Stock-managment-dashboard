import axios from 'axios';

export interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
  peRatio?: number;
  dividendYield?: number;
  eps?: number;
  high52Week?: number;
  low52Week?: number;
  lastUpdated: string;
}

export interface AlphaVantageOverview {
  symbol: string;
  name: string;
  marketCap: string;
  peRatio: number;
  pegRatio: number;
  bookValue: number;
  dividendYield: number;
  eps: number;
  revenuePerShareTTM: number;
  profitMargin: number;
  operatingMarginTTM: number;
  returnOnAssetsTTM: number;
  returnOnEquityTTM: number;
  revenueTTM: number;
  grossProfitTTM: number;
  dilutedEPSTTM: number;
  quarterlyEarningsGrowthYOY: number;
  quarterlyRevenueGrowthYOY: number;
  analystTargetPrice: number;
  trailingPE: number;
  forwardPE: number;
  priceToSalesRatioTTM: number;
  priceToBookRatio: number;
  evToRevenue: number;
  evToEbitda: number;
  beta: number;
  high52Week: number;
  low52Week: number;
  movingAverage50Day: number;
  movingAverage200Day: number;
  sharesOutstanding: number;
  sharesFloat: number;
  sharesShort: number;
  sharesShortPriorMonth: number;
  shortRatio: number;
  shortPercentOutstanding: number;
  shortPercentFloat: number;
  percentInsiders: number;
  percentInstitutions: number;
  forwardAnnualDividendRate: number;
  forwardAnnualDividendYield: number;
  payoutRatio: number;
  dividendDate: string;
  exDividendDate: string;
  lastSplitFactor: string;
  lastSplitDate: string;
}

export class AlphaVantageClient {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; 
  private readonly RATE_LIMIT_DELAY = 12000; 
  private lastRequestTime = 0;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(params: Record<string, string>): Promise<any> {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();

    const url = new URL(this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    url.searchParams.append('apikey', this.apiKey);

    try {
      const response = await axios.get(url.toString(), {
        timeout: 10000,
        headers: {
          'User-Agent': 'Portfolio-Dashboard/1.0'
        }
      });

      if (response.data['Error Message']) {
        throw new Error(`Alpha Vantage API Error: ${response.data['Error Message']}`);
      }

      if (response.data['Note']) {
        throw new Error(`Alpha Vantage Rate Limit: ${response.data['Note']}`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Request Failed: ${error.message}`);
      }
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<AlphaVantageQuote | null> {
    
    const cacheKey = `quote_${symbol}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      
      const alphaSymbol = this.convertToAlphaVantageSymbol(symbol);
      
      const data = await this.makeRequest({
        function: 'GLOBAL_QUOTE',
        symbol: alphaSymbol
      });

      const quote = data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        return null;
      }

      const result: AlphaVantageQuote = {
        symbol,
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        volume: parseInt(quote['06. volume']) || 0,
        high52Week: parseFloat(quote['03. high']) || 0,
        low52Week: parseFloat(quote['04. low']) || 0,
        lastUpdated: quote['07. latest trading day'] || new Date().toISOString()
      };

  
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  async getCompanyOverview(symbol: string): Promise<AlphaVantageOverview | null> {
  
    const cacheKey = `overview_${symbol}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION * 5) { 
      return cached.data;
    }

    try {
      const alphaSymbol = this.convertToAlphaVantageSymbol(symbol);
      
      const data = await this.makeRequest({
        function: 'OVERVIEW',
        symbol: alphaSymbol
      });

      if (!data || Object.keys(data).length === 0 || data['Symbol'] === undefined) {
        return null;
      }

      const result: AlphaVantageOverview = {
        symbol,
        name: data['Name'] || '',
        marketCap: data['MarketCapitalization'] || '0',
        peRatio: parseFloat(data['PERatio']) || 0,
        pegRatio: parseFloat(data['PEGRatio']) || 0,
        bookValue: parseFloat(data['BookValue']) || 0,
        dividendYield: parseFloat(data['DividendYield']) || 0,
        eps: parseFloat(data['EPS']) || 0,
        revenuePerShareTTM: parseFloat(data['RevenuePerShareTTM']) || 0,
        profitMargin: parseFloat(data['ProfitMargin']) || 0,
        operatingMarginTTM: parseFloat(data['OperatingMarginTTM']) || 0,
        returnOnAssetsTTM: parseFloat(data['ReturnOnAssetsTTM']) || 0,
        returnOnEquityTTM: parseFloat(data['ReturnOnEquityTTM']) || 0,
        revenueTTM: parseFloat(data['RevenueTTM']) || 0,
        grossProfitTTM: parseFloat(data['GrossProfitTTM']) || 0,
        dilutedEPSTTM: parseFloat(data['DilutedEPSTTM']) || 0,
        quarterlyEarningsGrowthYOY: parseFloat(data['QuarterlyEarningsGrowthYOY']) || 0,
        quarterlyRevenueGrowthYOY: parseFloat(data['QuarterlyRevenueGrowthYOY']) || 0,
        analystTargetPrice: parseFloat(data['AnalystTargetPrice']) || 0,
        trailingPE: parseFloat(data['TrailingPE']) || 0,
        forwardPE: parseFloat(data['ForwardPE']) || 0,
        priceToSalesRatioTTM: parseFloat(data['PriceToSalesRatioTTM']) || 0,
        priceToBookRatio: parseFloat(data['PriceToBookRatio']) || 0,
        evToRevenue: parseFloat(data['EVToRevenue']) || 0,
        evToEbitda: parseFloat(data['EVToEBITDA']) || 0,
        beta: parseFloat(data['Beta']) || 0,
        high52Week: parseFloat(data['52WeekHigh']) || 0,
        low52Week: parseFloat(data['52WeekLow']) || 0,
        movingAverage50Day: parseFloat(data['50DayMovingAverage']) || 0,
        movingAverage200Day: parseFloat(data['200DayMovingAverage']) || 0,
        sharesOutstanding: parseFloat(data['SharesOutstanding']) || 0,
        sharesFloat: parseFloat(data['SharesFloat']) || 0,
        sharesShort: parseFloat(data['SharesShort']) || 0,
        sharesShortPriorMonth: parseFloat(data['SharesShortPriorMonth']) || 0,
        shortRatio: parseFloat(data['ShortRatio']) || 0,
        shortPercentOutstanding: parseFloat(data['ShortPercentOutstanding']) || 0,
        shortPercentFloat: parseFloat(data['ShortPercentFloat']) || 0,
        percentInsiders: parseFloat(data['PercentInsiders']) || 0,
        percentInstitutions: parseFloat(data['PercentInstitutions']) || 0,
        forwardAnnualDividendRate: parseFloat(data['ForwardAnnualDividendRate']) || 0,
        forwardAnnualDividendYield: parseFloat(data['ForwardAnnualDividendYield']) || 0,
        payoutRatio: parseFloat(data['PayoutRatio']) || 0,
        dividendDate: data['DividendDate'] || '',
        exDividendDate: data['ExDividendDate'] || '',
        lastSplitFactor: data['LastSplitFactor'] || '',
        lastSplitDate: data['LastSplitDate'] || ''
      };

      
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`Error fetching overview for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<Map<string, AlphaVantageQuote>> {
    const results = new Map<string, AlphaVantageQuote>();
    
   
    for (const symbol of symbols) {
      try {
        const quote = await this.getQuote(symbol);
        if (quote) {
          results.set(symbol, quote);
        }
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
      }
    }

    return results;
  }

  private convertToAlphaVantageSymbol(symbol: string): string {
  
    if (symbol.endsWith('.NS')) {
      return symbol.replace('.NS', '.BSE');
    }
    return symbol;
  }

 
  generateFallbackData(symbol: string): AlphaVantageQuote {
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
    const volatility = 0.03;
    const trend = (Math.random() - 0.5) * 0.02;
    const randomComponent = (Math.random() - 0.5) * volatility;
    
    const priceChange = basePrice * (trend + randomComponent);
    const newPrice = Math.max(basePrice + priceChange, basePrice * 0.5);
    const change = newPrice - basePrice;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      price: Math.round(newPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high52Week: basePrice * (1.2 + Math.random() * 0.3),
      low52Week: basePrice * (0.7 - Math.random() * 0.2),
      lastUpdated: new Date().toISOString()
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}


let alphaVantageClient: AlphaVantageClient | null = null;

export function getAlphaVantageClient(): AlphaVantageClient {
  if (!alphaVantageClient) {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'CUUIQ0P6FJVKVD45';
    alphaVantageClient = new AlphaVantageClient(apiKey);
  }
  return alphaVantageClient;
}

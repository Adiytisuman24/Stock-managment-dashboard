'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Upload,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import PortfolioTable from '@/components/portfolio-table';
import SectorSummary from '@/components/sector-summary';
import PortfolioStats from '@/components/portfolio-stats';
import SectorAnalysis from '@/components/sector-analysis';
import { generateAIRecommendation, generateEnhancedMetrics } from '@/lib/ai-recommendations';
import { Portfolio, Stock, SectorSummary as SectorSummaryType, StockRecommendation, SectorAllocation } from '@/types/portfolio';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    stocks: [],
    totalInvestment: 0,
    currentValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

 
  const initializePortfolio = useCallback(() => {
    const sampleStocks: Stock[] = [
      
      {
        id: '1',
        name: 'HDFC Bank',
        symbol: 'HDFCBANK.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 50,
        purchasePrice: 1450,
        currentPrice: 1770,
        investment: 72500,
        presentValue: 88500,
        gainLoss: 16000,
        gainLossPercent: 22.07,
        portfolioPercent: 5.6,
        peRatio: 20.5,
        earnings: '₹45,000 Cr',
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Bajaj Finance',
        symbol: 'BAJFINANCE.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 10,
        purchasePrice: 4450,
        currentPrice: 6500,
        investment: 44500,
        presentValue: 65000,
        gainLoss: 20500,
        gainLossPercent: 46.07,
        portfolioPercent: 3.5,
        peRatio: 28.3,
        earnings: '₹12,500 Cr',
        lastUpdated: new Date()
      },
      {
        id: '3',
        name: 'ICICI Bank',
        symbol: 'ICICIBANK.NS',
        sector: 'Financial Sector',
        exchange: 'NSE',
        quantity: 75,
        purchasePrice: 800,
        currentPrice: 1200,
        investment: 60000,
        presentValue: 90000,
        gainLoss: 30000,
        gainLossPercent: 50.0,
        portfolioPercent: 4.7,
        peRatio: 18.2,
        earnings: '₹38,000 Cr',
        lastUpdated: new Date()
      },
      
      {
        id: '4',
        name: 'Affle India',
        symbol: 'AFFLE.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 50,
        purchasePrice: 950,
        currentPrice: 1200,
        investment: 47500,
        presentValue: 60000,
        gainLoss: 12500,
        gainLossPercent: 26.32,
        portfolioPercent: 3.7,
        peRatio: 28.5,
        earnings: '₹850 Cr',
        lastUpdated: new Date()
      },
      {
        id: '5',
        name: 'KPIT Technologies',
        symbol: 'KPITTECH.NS',
        sector: 'Information Technology',
        exchange: 'NSE',
        quantity: 100,
        purchasePrice: 950,
        currentPrice: 1800,
        investment: 95000,
        presentValue: 180000,
        gainLoss: 85000,
        gainLossPercent: 89.47,
        portfolioPercent: 7.4,
        peRatio: 35.2,
        earnings: '₹2,800 Cr',
        lastUpdated: new Date()
      },
     
      {
        id: '6',
        name: 'DMart',
        symbol: 'DMART.NS',
        sector: 'Consumer',
        exchange: 'NSE',
        quantity: 15,
        purchasePrice: 3800,
        currentPrice: 3500,
        investment: 57000,
        presentValue: 52500,
        gainLoss: -4500,
        gainLossPercent: -7.89,
        portfolioPercent: 4.4,
        peRatio: 45.2,
        earnings: '₹2,800 Cr',
        lastUpdated: new Date()
      },
      {
        id: '7',
        name: 'Tata Consumer',
        symbol: 'TATACONSUM.NS',
        sector: 'Consumer',
        exchange: 'NSE',
        quantity: 37,
        purchasePrice: 750,
        currentPrice: 850,
        investment: 27750,
        presentValue: 31450,
        gainLoss: 3700,
        gainLossPercent: 13.33,
        portfolioPercent: 2.2,
        peRatio: 35.1,
        earnings: '₹8,200 Cr',
        lastUpdated: new Date()
      },
      
      {
        id: '8',
        name: 'Tata Power',
        symbol: 'TATAPOWER.NS',
        sector: 'Power',
        exchange: 'NSE',
        quantity: 200,
        purchasePrice: 220,
        currentPrice: 350,
        investment: 44000,
        presentValue: 70000,
        gainLoss: 26000,
        gainLossPercent: 59.09,
        portfolioPercent: 3.4,
        peRatio: 28.7,
        earnings: '₹12,400 Cr',
        lastUpdated: new Date()
      },
      {
        id: '9',
        name: 'Suzlon Energy',
        symbol: 'SUZLON.NS',
        sector: 'Power',
        exchange: 'NSE',
        quantity: 500,
        purchasePrice: 38,
        currentPrice: 45,
        investment: 19000,
        presentValue: 22500,
        gainLoss: 3500,
        gainLossPercent: 18.42,
        portfolioPercent: 1.5,
        peRatio: 8.5,
        earnings: '₹850 Cr',
        lastUpdated: new Date()
      },
    
      {
        id: '10',
        name: 'Polycab India',
        symbol: 'POLYCAB.NS',
        sector: 'Others',
        exchange: 'NSE',
        quantity: 30,
        purchasePrice: 2500,
        currentPrice: 4500,
        investment: 75000,
        presentValue: 135000,
        gainLoss: 60000,
        gainLossPercent: 80.0,
        portfolioPercent: 5.8,
        peRatio: 25.3,
        earnings: '₹8,900 Cr',
        lastUpdated: new Date()
      }
    ];

    
    const totalInvestment = sampleStocks.reduce((sum, stock) => sum + stock.investment, 0);
    const currentValue = sampleStocks.reduce((sum, stock) => sum + stock.presentValue, 0);
    const totalGainLoss = currentValue - totalInvestment;
    const totalGainLossPercent = (totalGainLoss / totalInvestment) * 100;

   
    sampleStocks.forEach(stock => {
      stock.portfolioPercent = (stock.investment / totalInvestment) * 100;
      
    
      const enhancedMetrics = generateEnhancedMetrics(stock);
      Object.assign(stock, enhancedMetrics);
      
      
      const aiRec = generateAIRecommendation(stock);
      stock.aiRecommendation = aiRec.action;
      stock.aiRecommendationReason = aiRec.reason;
    });

    setPortfolio({
      stocks: sampleStocks,
      totalInvestment,
      currentValue,
      totalGainLoss,
      totalGainLossPercent
    });
  }, []);

  const fetchStockData = useCallback(async () => {
    if (portfolio.stocks.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const symbols = portfolio.stocks.map(stock => stock.symbol).join(',');
      const response = await fetch(`/api/stocks?symbols=${symbols}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stock data: ${response.status} ${response.statusText}`);
      }
      
      const stockData = await response.json();
      
      if (!stockData || typeof stockData !== 'object') {
        throw new Error('Invalid response format');
      }
      
      
      const updatedStocks = portfolio.stocks.map(stock => {
        const newData = stockData[stock.symbol];
        if (newData) {
          const currentPrice = newData.currentPrice || stock.currentPrice;
          const presentValue = stock.quantity * currentPrice;
          const gainLoss = presentValue - stock.investment;
          const gainLossPercent = (gainLoss / stock.investment) * 100;
          
          const updatedStock = {
            ...stock,
            currentPrice,
            presentValue,
            gainLoss,
            gainLossPercent,
            peRatio: newData.peRatio || stock.peRatio,
            earnings: newData.earnings || stock.earnings,
            lastUpdated: new Date()
          };
          
          const aiRec = generateAIRecommendation(updatedStock);
          updatedStock.aiRecommendation = aiRec.action;
          updatedStock.aiRecommendationReason = aiRec.reason;
          
          return updatedStock;
        }
        return stock;
      });

      const totalInvestment = updatedStocks.reduce((sum, stock) => sum + stock.investment, 0);
      const currentValue = updatedStocks.reduce((sum, stock) => sum + stock.presentValue, 0);
      const totalGainLoss = currentValue - totalInvestment;
      const totalGainLossPercent = (totalGainLoss / totalInvestment) * 100;

      setPortfolio({
        stocks: updatedStocks,
        totalInvestment,
        currentValue,
        totalGainLoss,
        totalGainLossPercent
      });

      setLastUpdated(new Date());
    } catch (err) {
      setError(`Failed to fetch stock data: ${err instanceof Error ? err.message : 'Unknown error'}. Using cached data.`);
      console.error('Stock data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [portfolio.stocks]);

  useEffect(() => {
    if (autoRefresh && portfolio.stocks.length > 0) {
      const interval = setInterval(fetchStockData, 60000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchStockData, portfolio.stocks.length, loading]);

 
  useEffect(() => {
    initializePortfolio();
    
    
    const timer = setTimeout(() => {
      fetchStockData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [initializePortfolio]);

  const getSectorSummaries = (): SectorSummaryType[] => {
    const sectorMap = new Map<string, SectorSummaryType>();

    portfolio.stocks.forEach(stock => {
      if (sectorMap.has(stock.sector)) {
        const existing = sectorMap.get(stock.sector)!;
        existing.totalStocks += 1;
        existing.totalInvestment += stock.investment;
        existing.currentValue += stock.presentValue;
        existing.gainLoss += stock.gainLoss;
      } else {
        sectorMap.set(stock.sector, {
          sector: stock.sector,
          totalStocks: 1,
          totalInvestment: stock.investment,
          currentValue: stock.presentValue,
          gainLoss: stock.gainLoss,
          gainLossPercent: 0,
          portfolioPercent: 0
        });
      }
    });

    const sectors = Array.from(sectorMap.values());
    sectors.forEach(sector => {
      sector.gainLossPercent = (sector.gainLoss / sector.totalInvestment) * 100;
      sector.portfolioPercent = (sector.totalInvestment / portfolio.totalInvestment) * 100;
    });

    return sectors.sort((a, b) => b.currentValue - a.currentValue);
  };

  
  const stockRecommendations: StockRecommendation[] = [
    { stock: 'KPIT Tech', gainPercent: 89.47, remarks: 'High return, but now overvalued. Consider partial profit booking.', action: 'book-profit' },
    { stock: 'Polycab', gainPercent: 80.0, remarks: 'Excellent growth and fundamentals. Continue to hold/add on dips.', action: 'hold' },
    { stock: 'Tata Power', gainPercent: 59.09, remarks: 'Stable growth, still has long-term potential in renewables. Hold.', action: 'hold' },
    { stock: 'ICICI Bank', gainPercent: 50.0, remarks: 'Strong core bank with excellent fundamentals. Hold/Increase stake.', action: 'add' },
    { stock: 'Bajaj Finance', gainPercent: 46.07, remarks: 'Great run; growth slowing due to valuations. Hold, trim slightly.', action: 'reduce' },
    { stock: 'Affle India', gainPercent: 26.32, remarks: 'Good growth but volatile. Hold, track closely.', action: 'hold' },
    { stock: 'HDFC Bank', gainPercent: 22.07, remarks: 'Underperformed peers. Wait for re-rating. Hold.', action: 'hold' },
    { stock: 'Suzlon Energy', gainPercent: 18.42, remarks: 'Turnaround stock, high risk. Exit, better alternatives.', action: 'exit' },
    { stock: 'Tata Consumer', gainPercent: 13.33, remarks: 'Stable FMCG exposure. Hold.', action: 'hold' },
    { stock: 'DMart', gainPercent: -7.89, remarks: 'Valuation too high; Exit. Better FMCG plays exist.', action: 'exit' }
  ];

  const sectorAllocations: SectorAllocation[] = [
    { sector: 'Financial Sector', currentAllocation: 25, idealAllocation: '30–35% (reduce small caps)' },
    { sector: 'Information Technology', currentAllocation: 28, idealAllocation: '20–25% (consolidate winners only)' },
    { sector: 'Consumer', currentAllocation: 12, idealAllocation: '15–20%' },
    { sector: 'Power', currentAllocation: 15, idealAllocation: '10–15% (keep only quality)' },
    { sector: 'Others', currentAllocation: 20, idealAllocation: '10–15% (diversification)' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Excel file uploaded:', file.name);
      initializePortfolio();
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time stock portfolio tracking with live Alpha Vantage data</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Excel
                </Button>
              </label>
            </div>
            
            <Button 
              variant="outline" 
              onClick={toggleAutoRefresh}
              className={autoRefresh ? 'bg-green-50 border-green-300' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            
            <Button onClick={fetchStockData} disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
          </div>
        </div>

        
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Live Yahoo finance and google finance Integration</h3>
                <p className="text-sm text-green-800">
                  <strong>Professional Data Source:</strong> Using Yahoo finance and google finance API for reliable, real-time financial data. 
                  Stock prices, P/E ratios, market cap, and earnings are updated every minute with intelligent caching and built in love with adiyti suman.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        
        {lastUpdated && (
          <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Last updated: {lastUpdated.toLocaleString()}
            {autoRefresh && <Badge variant="secondary">Auto-refreshing every 60s</Badge>}
          </div>
        )}

       
        <PortfolioStats portfolio={portfolio} loading={loading} />

       
        <div className="mb-8">
          <SectorSummary stocks={portfolio.stocks} loading={loading} />
        </div>

    
        <div className="mb-8">
          <SectorAnalysis 
            sectorSummaries={getSectorSummaries()}
            stockRecommendations={stockRecommendations}
            sectorAllocations={sectorAllocations}
          />
        </div>

     
        <div className="mb-8">
          <PortfolioTable stocks={portfolio.stocks} loading={loading} />
        </div>

      
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Disclaimer:</strong> Stock prices and financial data are provided by Yahoo finance and  google finance API for informational purposes only. 
            While we strive for accuracy, please verify with official sources before making investment decisions. 
            This application is for educational and demonstration purposes and is built in love with adiytisuman
          </p>
        </div>
      </div>
    </div>
  );
}

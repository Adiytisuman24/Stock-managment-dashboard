export interface Stock {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  exchange: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  portfolioPercent: number;
  peRatio?: number;
  earnings?: string;
  // Enhanced Financial Metrics
  marketCap?: number;
  latestEarnings?: string;
  revenueTTM?: number;
  ebitdaTTM?: number;
  ebitdaPercent?: number;
  pat?: number;
  patPercent?: number;
  cfoMarch24?: number;
  cfoNext5Years?: number;
  freeCashFlowNext5Years?: number;
  debtToEquity?: number;
  bookValue?: number;
  revenue?: number;
  ebitda?: number;
  profit?: number;
  priceToSales?: number;
  cfoToEbitda?: number;
  cfoToPat?: number;
  priceToBook?: number;
  stage2?: boolean;
  salePrice?: number;
  aiRecommendation?: 'exit' | 'hold' | 'add';
  aiRecommendationReason?: string;
  lastUpdated: Date;
}

export interface Portfolio {
  stocks: Stock[];
  totalInvestment: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export interface SectorSummary {
  sector: string;
  totalStocks: number;
  totalInvestment: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  portfolioPercent: number;
}

export interface StockRecommendation {
  stock: string;
  gainPercent: number;
  remarks: string;
  action: 'hold' | 'add' | 'exit' | 'book-profit' | 'reduce';
}

export interface SectorAllocation {
  sector: string;
  idealAllocation: string;
  currentAllocation: number;
}
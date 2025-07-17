// AI-powered stock recommendation engine
import { Stock } from '@/types/portfolio';

export interface AIRecommendation {
  action: 'exit' | 'hold' | 'add';
  reason: string;
  confidence: number;
}

export function generateAIRecommendation(stock: Stock): AIRecommendation {
  const metrics = {
    gainLossPercent: stock.gainLossPercent,
    peRatio: stock.peRatio || 0,
    priceToBook: stock.priceToBook || 0,
    debtToEquity: stock.debtToEquity || 0,
    ebitdaPercent: stock.ebitdaPercent || 0,
    patPercent: stock.patPercent || 0,
    cfoToEbitda: stock.cfoToEbitda || 0,
    cfoToPat: stock.cfoToPat || 0,
    stage2: stock.stage2 || false
  };

  // AI Decision Logic
  let score = 0;
  let reasons: string[] = [];

  // Performance Analysis
  if (metrics.gainLossPercent > 50) {
    score -= 2;
    reasons.push('High gains suggest overvaluation');
  } else if (metrics.gainLossPercent > 20) {
    score -= 1;
    reasons.push('Good gains, consider profit booking');
  } else if (metrics.gainLossPercent < -30) {
    score -= 3;
    reasons.push('Significant losses indicate fundamental issues');
  }

  // Valuation Metrics
  if (metrics.peRatio > 30) {
    score -= 1;
    reasons.push('High P/E ratio indicates overvaluation');
  } else if (metrics.peRatio < 15 && metrics.peRatio > 0) {
    score += 1;
    reasons.push('Attractive P/E ratio');
  }

  if (metrics.priceToBook > 3) {
    score -= 1;
    reasons.push('High P/B ratio');
  } else if (metrics.priceToBook < 1.5) {
    score += 1;
    reasons.push('Reasonable P/B ratio');
  }

  // Financial Health
  if (metrics.debtToEquity > 1) {
    score -= 2;
    reasons.push('High debt levels are concerning');
  } else if (metrics.debtToEquity < 0.3) {
    score += 1;
    reasons.push('Low debt levels indicate financial stability');
  }

  if (metrics.ebitdaPercent > 20) {
    score += 2;
    reasons.push('Strong EBITDA margins');
  } else if (metrics.ebitdaPercent < 10) {
    score -= 1;
    reasons.push('Weak EBITDA margins');
  }

  if (metrics.patPercent > 15) {
    score += 2;
    reasons.push('Excellent profit margins');
  } else if (metrics.patPercent < 5) {
    score -= 1;
    reasons.push('Low profit margins');
  }

  // Cash Flow Analysis
  if (metrics.cfoToEbitda > 0.8) {
    score += 1;
    reasons.push('Strong cash flow conversion');
  } else if (metrics.cfoToEbitda < 0.5) {
    score -= 1;
    reasons.push('Poor cash flow conversion');
  }

  if (metrics.cfoToPat > 1.2) {
    score += 1;
    reasons.push('Cash flow exceeds reported profits');
  }

  // Stage-2 Analysis
  if (metrics.stage2) {
    score += 2;
    reasons.push('Stock is in Stage-2 uptrend');
  } else {
    score -= 1;
    reasons.push('Stock not in favorable Stage-2 pattern');
  }

  // Sector-specific adjustments
  if (stock.sector === 'Information Technology') {
    if (metrics.peRatio < 25) score += 1;
  } else if (stock.sector === 'Financial Sector') {
    if (metrics.priceToBook < 2) score += 1;
  } else if (stock.sector === 'Power') {
    if (metrics.debtToEquity < 0.5) score += 1;
  }

  // Final Decision
  let action: 'exit' | 'hold' | 'add';
  let confidence: number;

  if (score <= -4) {
    action = 'exit';
    confidence = 90;
  } else if (score <= -2) {
    action = 'exit';
    confidence = 75;
  } else if (score <= 0) {
    action = 'hold';
    confidence = 60;
  } else if (score <= 2) {
    action = 'hold';
    confidence = 70;
  } else if (score <= 4) {
    action = 'add';
    confidence = 75;
  } else {
    action = 'add';
    confidence = 85;
  }

  return {
    action,
    reason: reasons.slice(0, 3).join('; '),
    confidence
  };
}

// Generate enhanced financial metrics (simulated for demo)
export function generateEnhancedMetrics(stock: Stock): Partial<Stock> {
  const basePrice = stock.currentPrice;
  const marketCapBase = basePrice * 10000000; // Simulated shares outstanding

  return {
    marketCap: marketCapBase + (Math.random() - 0.5) * marketCapBase * 0.1,
    latestEarnings: `₹${(Math.random() * 5000 + 500).toFixed(0)} Cr`,
    revenueTTM: (Math.random() * 50000 + 5000) * 10000000,
    ebitdaTTM: (Math.random() * 10000 + 1000) * 10000000,
    ebitdaPercent: Math.random() * 25 + 5,
    pat: (Math.random() * 5000 + 500) * 10000000,
    patPercent: Math.random() * 20 + 2,
    cfoMarch24: (Math.random() * 3000 + 300) * 10000000,
    cfoNext5Years: (Math.random() * 15000 + 1500) * 10000000,
    freeCashFlowNext5Years: (Math.random() * 12000 + 1200) * 10000000,
    debtToEquity: Math.random() * 1.5,
    bookValue: basePrice * (0.3 + Math.random() * 0.7),
    revenue: (Math.random() * 50000 + 5000) * 10000000,
    ebitda: (Math.random() * 10000 + 1000) * 10000000,
    profit: (Math.random() * 5000 + 500) * 10000000,
    priceToSales: Math.random() * 8 + 0.5,
    cfoToEbitda: 0.4 + Math.random() * 0.6,
    cfoToPat: 0.8 + Math.random() * 0.8,
    priceToBook: Math.random() * 4 + 0.5,
    stage2: Math.random() > 0.4,
    salePrice: basePrice * (0.95 + Math.random() * 0.1)
  };
}
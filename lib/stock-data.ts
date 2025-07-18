

export interface GoogleFinanceData {
  symbol: string;
  peRatio?: number;
  earnings?: string;
  revenue?: string;
}

export async function fetchGoogleFinanceData(symbols: string[]): Promise<Map<string, GoogleFinanceData>> {
  const results = new Map<string, GoogleFinanceData>();
  

  symbols.forEach(symbol => {
    results.set(symbol, {
      symbol,
      peRatio: 15 + Math.random() * 25,
      earnings: `₹${(Math.random() * 50000 + 5000).toFixed(0)} Cr`,
      revenue: `₹${(Math.random() * 100000 + 10000).toFixed(0)} Cr`
    });
  });
  
  return results;
}


function getBasePriceForSymbol(symbol: string): number {
  const basePrices: { [key: string]: number } = {
    'HDFCBANK.NS': 1770,
    'BAJFINANCE.NS': 6500,
    'RELIANCE.NS': 2450,
    'TATACONSUM.NS': 850,
    'INFY.NS': 1450,
    'ICICIBANK.NS': 1200,
    'POLYCAB.NS': 4500,
    'KPITTECH.NS': 1800,
    'TATAPOWER.NS': 350,
    'PIDILITE.NS': 2800,
    'AFFLE.NS': 1200,
    'TANLA.NS': 800,
    'GENSOL.NS': 150,
    'BLSE.NS': 90,
    'TATATECH.NS': 900,
    'KPIGREEN.NS': 200,
    'SUZLON.NS': 45,
    'HARIOMPIPE.NS': 250,
    'SAVANI.NS': 180,
    'DMART.NS': 3500
  };
  
  return basePrices[symbol] || 1000;
}

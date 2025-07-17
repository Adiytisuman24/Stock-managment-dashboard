'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Stock, SectorSummary } from '@/types/portfolio';

interface SectorSummaryProps {
  stocks: Stock[];
  loading: boolean;
}

export default function SectorSummary({ stocks, loading }: SectorSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getSectorSummary = (): SectorSummary[] => {
    const sectorMap = new Map<string, SectorSummary>();

    stocks.forEach(stock => {
      const investment = stock.quantity * stock.purchasePrice;
      const currentValue = stock.quantity * stock.currentPrice;
      const gainLoss = currentValue - investment;
      const gainLossPercent = (gainLoss / investment) * 100;

      if (sectorMap.has(stock.sector)) {
        const existing = sectorMap.get(stock.sector)!;
        existing.totalStocks += 1;
        existing.totalInvestment += investment;
        existing.currentValue += currentValue;
        existing.gainLoss += gainLoss;
        existing.gainLossPercent = (existing.gainLoss / existing.totalInvestment) * 100;
      } else {
        sectorMap.set(stock.sector, {
          sector: stock.sector,
          totalStocks: 1,
          totalInvestment: investment,
          currentValue: currentValue,
          gainLoss: gainLoss,
          gainLossPercent: gainLossPercent
        });
      }
    });

    return Array.from(sectorMap.values()).sort((a, b) => b.currentValue - a.currentValue);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sector Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sectorSummaries = getSectorSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectorSummaries.map((sector) => (
            <div key={sector.sector} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{sector.sector}</h3>
                <Badge variant="outline">{sector.totalStocks} stocks</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Invested:</span>
                  <span className="font-medium">{formatCurrency(sector.totalInvestment)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-medium">{formatCurrency(sector.currentValue)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">P&L:</span>
                  <span className={`font-medium ${
                    sector.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(sector.gainLoss)} ({formatPercent(sector.gainLossPercent)})
                  </span>
                </div>
              </div>
              
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    sector.gainLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Math.abs(sector.gainLossPercent) * 2, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
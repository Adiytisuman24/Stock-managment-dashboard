'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart 
} from 'lucide-react';
import { Portfolio } from '@/types/portfolio';

interface PortfolioStatsProps {
  portfolio: Portfolio;
  loading: boolean;
}

export default function PortfolioStats({ portfolio, loading }: PortfolioStatsProps) {
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Investment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Total Investment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(portfolio.totalInvestment)}
          </div>
          <Badge variant="outline" className="mt-1">
            {portfolio.stocks.length} Holdings
          </Badge>
        </CardContent>
      </Card>

      {/* Current Value */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <PieChart className="h-4 w-4 mr-1" />
            Current Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(portfolio.currentValue)}
          </div>
          <Badge variant="outline" className="mt-1">
            Live Market Price
          </Badge>
        </CardContent>
      </Card>

      {/* Total Gain/Loss */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            {portfolio.totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
            )}
            Total P&L
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(portfolio.totalGainLoss)}
          </div>
          <Badge 
            variant={portfolio.totalGainLoss >= 0 ? 'default' : 'destructive'}
            className="mt-1"
          >
            {formatPercent(portfolio.totalGainLossPercent)}
          </Badge>
        </CardContent>
      </Card>

      {/* Day's Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Day's Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            +₹12,450
          </div>
          <Badge variant="default" className="mt-1">
            +2.34%
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
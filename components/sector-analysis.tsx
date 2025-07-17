'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { SectorSummary, StockRecommendation, SectorAllocation } from '@/types/portfolio';

interface SectorAnalysisProps {
  sectorSummaries: SectorSummary[];
  stockRecommendations: StockRecommendation[];
  sectorAllocations: SectorAllocation[];
}

export default function SectorAnalysis({ 
  sectorSummaries, 
  stockRecommendations, 
  sectorAllocations 
}: SectorAnalysisProps) {
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

  const getActionBadge = (action: string) => {
    const actionConfig = {
      'hold': { variant: 'secondary' as const, icon: CheckCircle },
      'add': { variant: 'default' as const, icon: TrendingUp },
      'exit': { variant: 'destructive' as const, icon: AlertTriangle },
      'book-profit': { variant: 'default' as const, icon: TrendingUp },
      'reduce': { variant: 'outline' as const, icon: TrendingDown }
    };
    
    const config = actionConfig[action as keyof typeof actionConfig] || actionConfig.hold;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {action.toUpperCase()}
      </Badge>
    );
  };

  // Separate recommendations by performance
  const topPerformers = stockRecommendations.filter(stock => stock.gainPercent > 20);
  const moderatePerformers = stockRecommendations.filter(stock => stock.gainPercent >= 0 && stock.gainPercent <= 20);
  const underPerformers = stockRecommendations.filter(stock => stock.gainPercent < 0);

  return (
    <div className="space-y-8">
      {/* Sector Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sector-wise Portfolio Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Investment</TableHead>
                  <TableHead className="text-right">Present Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead className="text-right">% Portfolio</TableHead>
                  <TableHead className="text-right">Gain/Loss %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectorSummaries.map((sector) => (
                  <TableRow key={sector.sector}>
                    <TableCell className="font-medium">{sector.sector}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sector.totalInvestment)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(sector.currentValue)}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      sector.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(sector.gainLoss)}
                    </TableCell>
                    <TableCell className="text-right">{sector.portfolioPercent.toFixed(0)}%</TableCell>
                    <TableCell className={`text-right font-medium ${
                      sector.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(sector.gainLossPercent)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 font-bold bg-gray-50">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(sectorSummaries.reduce((sum, s) => sum + s.totalInvestment, 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(sectorSummaries.reduce((sum, s) => sum + s.currentValue, 0))}
                  </TableCell>
                  <TableCell className={`text-right ${
                    sectorSummaries.reduce((sum, s) => sum + s.gainLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(sectorSummaries.reduce((sum, s) => sum + s.gainLoss, 0))}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                  <TableCell className={`text-right ${
                    sectorSummaries.reduce((sum, s) => sum + s.gainLoss, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercent(
                      (sectorSummaries.reduce((sum, s) => sum + s.gainLoss, 0) / 
                       sectorSummaries.reduce((sum, s) => sum + s.totalInvestment, 0)) * 100
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            Top Performers (20%+ Gains)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Gain %</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{stock.stock}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      +{stock.gainPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="max-w-md">{stock.remarks}</TableCell>
                    <TableCell>{getActionBadge(stock.action)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Moderate Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <CheckCircle className="h-5 w-5" />
            Moderate Performers (0-20% Gains)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Gain/Loss %</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moderatePerformers.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{stock.stock}</TableCell>
                    <TableCell className="text-right font-medium text-blue-600">
                      +{stock.gainPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell>{stock.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Under Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <TrendingDown className="h-5 w-5" />
            Under Performers (Losses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Loss %</TableHead>
                  <TableHead>Reason & Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {underPerformers.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{stock.stock}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {stock.gainPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="max-w-md">{stock.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sector Allocation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recommended Sector Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sector</TableHead>
                  <TableHead>Current Allocation</TableHead>
                  <TableHead>Ideal Allocation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectorAllocations.map((allocation, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{allocation.sector}</TableCell>
                    <TableCell>{allocation.currentAllocation.toFixed(1)}%</TableCell>
                    <TableCell className="font-medium text-blue-600">{allocation.idealAllocation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
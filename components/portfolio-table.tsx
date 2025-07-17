'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Stock } from '@/types/portfolio';

interface PortfolioTableProps {
  stocks: Stock[];
  loading: boolean;
}

export default function PortfolioTable({ stocks, loading }: PortfolioTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

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

  const formatCrores = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(0)} Cr`;
  };

  const getRecommendationBadge = (recommendation: string) => {
    const config = {
      'exit': { variant: 'destructive' as const, text: 'EXIT' },
      'hold': { variant: 'secondary' as const, text: 'HOLD' },
      'add': { variant: 'default' as const, text: 'ADD' }
    };
    
    const rec = config[recommendation as keyof typeof config] || config.hold;
    return <Badge variant={rec.variant}>{rec.text}</Badge>;
  };
  const sectors = useMemo(() => {
    const uniqueSectors = [...new Set(stocks.map(stock => stock.sector))];
    return uniqueSectors.sort();
  }, [stocks]);

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(stock => {
      const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof Stock];
        let bValue: any = b[sortConfig.key as keyof Stock];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [stocks, searchTerm, selectedSector, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig && prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('name')}>
                    Particulars (Stock Name)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('purchasePrice')}>
                    Purchase Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('investment')}>
                    Investment
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Portfolio %</TableHead>
                <TableHead>NSE/BSE</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('currentPrice')}>
                    CMP
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('presentValue')}>
                    Present Value
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('gainLoss')}>
                    Gain/Loss
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead>Latest Earnings</TableHead>
                <TableHead className="text-right">Revenue (TTM)</TableHead>
                <TableHead className="text-right">EBITDA (TTM)</TableHead>
                <TableHead className="text-right">EBITDA %</TableHead>
                <TableHead className="text-right">PAT</TableHead>
                <TableHead className="text-right">PAT %</TableHead>
                <TableHead className="text-right">CFO Mar'24</TableHead>
                <TableHead className="text-right">CFO Next 5Y</TableHead>
                <TableHead className="text-right">FCF Next 5Y</TableHead>
                <TableHead className="text-right">Debt/Equity</TableHead>
                <TableHead className="text-right">Book Value</TableHead>
                <TableHead className="text-right">P/S Ratio</TableHead>
                <TableHead className="text-right">CFO/EBITDA</TableHead>
                <TableHead className="text-right">CFO/PAT</TableHead>
                <TableHead className="text-right">P/E Ratio</TableHead>
                <TableHead className="text-right">P/B Ratio</TableHead>
                <TableHead className="text-center">Stage-2</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
                <TableHead className="text-center">AI Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStocks.map((stock) => (
                <TableRow key={stock.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold text-gray-900">{stock.name}</div>
                      <div className="text-sm text-gray-500">{stock.symbol}</div>
                      <Badge variant="outline" className="mt-1">{stock.sector}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(stock.purchasePrice)}</TableCell>
                  <TableCell className="text-right">{stock.quantity}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(stock.investment)}</TableCell>
                  <TableCell className="text-right">{stock.portfolioPercent.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{stock.exchange}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end gap-1">
                      {formatCurrency(stock.currentPrice)}
                      {stock.gainLossPercent >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(stock.presentValue)}</TableCell>
                  <TableCell className="text-right">
                    <div className={`font-medium ${stock.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stock.gainLoss)}
                    </div>
                    <div className={`text-sm ${stock.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(stock.gainLossPercent)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.marketCap ? formatCrores(stock.marketCap) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{stock.latestEarnings || 'N/A'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.revenueTTM ? formatCrores(stock.revenueTTM) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.ebitdaTTM ? formatCrores(stock.ebitdaTTM) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.ebitdaPercent ? `${stock.ebitdaPercent.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.pat ? formatCrores(stock.pat) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.patPercent ? `${stock.patPercent.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.cfoMarch24 ? formatCrores(stock.cfoMarch24) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.cfoNext5Years ? formatCrores(stock.cfoNext5Years) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.freeCashFlowNext5Years ? formatCrores(stock.freeCashFlowNext5Years) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.debtToEquity ? stock.debtToEquity.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.bookValue ? formatCurrency(stock.bookValue) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.priceToSales ? stock.priceToSales.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.cfoToEbitda ? stock.cfoToEbitda.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.cfoToPat ? stock.cfoToPat.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.peRatio ? stock.peRatio.toFixed(1) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.priceToBook ? stock.priceToBook.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch 
                      checked={stock.stage2 || false} 
                      disabled 
                      className="data-[state=checked]:bg-green-600"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.salePrice ? formatCurrency(stock.salePrice) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      {stock.aiRecommendation && getRecommendationBadge(stock.aiRecommendation)}
                      {stock.aiRecommendationReason && (
                        <span className="text-xs text-gray-500 max-w-32 truncate" title={stock.aiRecommendationReason}>
                          {stock.aiRecommendationReason}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedStocks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No stocks found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
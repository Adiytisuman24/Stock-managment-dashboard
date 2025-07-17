# Dynamic Portfolio Dashboard

A comprehensive real-time portfolio dashboard built with Next.js, React, TypeScript, and TailwindCSS that displays stock holdings with live updates for Current Market Price (CMP), P/E ratio, and earnings data from Yahoo Finance and Google Finance.

## 🚀 Features

### Core Functionality
- **Real-time Stock Data**: Live updates every 15 seconds from Yahoo Finance and Google Finance
- **Comprehensive Portfolio Table**: All columns as specified including Particulars, Purchase Price, Quantity, Investment, Portfolio %, NSE/BSE, CMP, Present Value, Gain/Loss, P/E Ratio, and Latest Earnings
- **Sector Grouping**: Organize holdings by sector with detailed summaries
- **Excel Import**: Upload and parse portfolio data from Excel files
- **Visual Indicators**: Color-coded gains (green) and losses (red) with smooth transitions
- **Advanced Analytics**: Stock recommendations, sector allocation advice, and performance analysis

### Data Sources Integration
- **SerpAPI Google Finance**: Real-time stock prices, P/E ratios, and earnings data
- **Yahoo Finance API**: Backup data source using unofficial libraries
- **Rate Limiting & Caching**: Optimized API calls with 15-second cache duration
- **Error Handling**: Graceful fallbacks and user notifications

### UI/UX Features
- **Responsive Design**: Optimized for desktop and mobile devices
- **Interactive Tables**: Sortable columns, search, and filtering capabilities
- **Performance Optimized**: Memoization, lazy loading, and efficient re-rendering
- **Loading States**: Skeleton loaders and progress indicators
- **Auto-refresh Toggle**: User-controlled automatic data updates

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Data Fetching**: yahoo-finance2, custom Google Finance scraper
- **API Integration**: SerpAPI for Google Finance data
- **State Management**: React hooks (useState, useEffect, useMemo, useCallback)
- **Icons**: Lucide React
- **Charts**: Recharts (optional for visualizations)
- **Performance**: React.memo, API caching, request batching

## 📊 Portfolio Analysis Features

### Sector-wise Summary Table
| Category | Investment | Present Value | Gain/Loss | % Portfolio | Gain/Loss % |
|----------|------------|---------------|-----------|-------------|-------------|
| Financial Sector | ₹3,28,450 | ₹3,86,328.70 | +₹57,878.70 | 21% | +17.62% |
| Tech Sector | ₹3,37,820 | ₹3,19,697.30 | -₹18,122.70 | 22% | -5.36% |
| Consumer | ₹2,63,565 | ₹2,77,958.70 | +₹14,393.70 | 17% | +5.46% |

### Stock Recommendations
- **Top Performers**: Stocks with 20%+ gains with hold/add recommendations
- **Moderate Performers**: 0-20% gains with specific action items
- **Under Performers**: Loss-making stocks with exit strategies

### Sector Allocation Advice
- Current vs. ideal allocation percentages
- Rebalancing recommendations
- Risk management suggestions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd portfolio-dashboard
```

2. **Install dependencies**:
```bash
npm install
```

3. **Install additional data fetching libraries**:
```bash
npm install serpapi yahoo-finance2
```

4. **Configure environment variables**:
```bash
# Create .env.local file and add your SerpAPI key
SERPAPI_KEY=your_serpapi_key_here
```

5. **Start the development server**:
```bash
npm run dev
```

6. **Open the application**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── stocks/route.ts      # Yahoo/Google Finance API integration
│   │   └── upload/route.ts      # Excel file upload handler
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx              # Root layout with metadata
│   └── page.tsx                # Main dashboard component
├── components/
│   ├── portfolio-stats.tsx     # Portfolio summary cards
│   ├── portfolio-table.tsx     # Comprehensive stock table
│   ├── sector-summary.tsx      # Sector breakdown component
│   ├── sector-analysis.tsx     # Advanced sector analysis
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── serpapi-client.ts       # SerpAPI Google Finance integration
│   └── stock-data.ts           # Data fetching utilities
├── types/
│   └── portfolio.ts            # TypeScript interfaces
└── README.md
```

## 🔌 API Integration

### SerpAPI Google Finance Integration
```typescript
import { getSerpApiClient } from '@/lib/serpapi-client';

// Fetch real-time stock data from Google Finance
const client = getSerpApiClient();
const stockData = await client.fetchMultipleStocks(['HDFCBANK.NS', 'RELIANCE.NS']);
```

### Yahoo Finance Integration (Backup)
```typescript
import yahooFinance from 'yahoo-finance2';

// Backup data source
const quotes = await yahooFinance.quote(['HDFCBANK.NS', 'RELIANCE.NS']);
```

### Rate Limiting & Caching
- 15-second cache duration to prevent API abuse
- Batched requests for multiple symbols
- Graceful error handling with fallback data

## 🔑 API Configuration

### SerpAPI Setup
1. **Sign up** at [SerpAPI](https://serpapi.com/)
2. **Get your API key** from the dashboard
3. **Add to environment variables**:
```bash
SERPAPI_KEY=your_actual_api_key_here
```

### Stock Symbol Mappings
The application automatically maps NSE symbols to Google Finance format:
```typescript
// Example mappings
'HDFCBANK.NS' → 'HDFCBANK:NSE'
'BAJFINANCE.NS' → 'BAJFINANCE:NSE'
'ICICIBANK.NS' → 'ICICIBANK:NSE'
```

## 📈 Data Structure

### Stock Interface
```typescript
interface Stock {
  id: string;
  name: string;                 // Stock name
  symbol: string;              // Trading symbol (e.g., HDFCBANK.NS)
  sector: string;              // Sector classification
  exchange: string;            // NSE/BSE
  quantity: number;            // Number of shares
  purchasePrice: number;       // Average purchase price
  currentPrice: number;        // Current market price (CMP)
  investment: number;          // Purchase Price × Qty
  presentValue: number;        // CMP × Qty
  gainLoss: number;           // Present Value - Investment
  gainLossPercent: number;    // Gain/Loss percentage
  portfolioPercent: number;   // Weight in portfolio
  peRatio?: number;           // P/E ratio from Google Finance
  earnings?: string;          // Latest earnings data
  lastUpdated: Date;          // Last data update timestamp
}
```

## 🎯 Technical Challenges Addressed

### API Limitations
- **Unofficial APIs**: Yahoo and Google Finance don't have official public APIs
- **Rate Limiting**: Implemented caching and request throttling
- **Data Accuracy**: Added disclaimers and error handling for data variations
- **Site Changes**: Robust error handling for scraping failures

### Performance Optimization
- **Caching**: 15-second cache for API responses
- **Memoization**: React.memo and useMemo for expensive calculations
- **Batching**: Single API call for multiple stock symbols
- **Lazy Loading**: Components loaded on demand

### Error Handling
- **API Failures**: Graceful fallbacks with cached data
- **Network Issues**: Clear error messages and retry mechanisms
- **Data Validation**: Input sanitization and type checking

### Security Considerations
- **No Client-side API Keys**: All external calls proxied through backend
- **Input Validation**: Sanitized user inputs and file uploads
- **CORS Handling**: Proper cross-origin request management

## 🔄 SerpAPI Integration

```typescript
// Fetch live data from Google Finance via SerpAPI
const serpApiClient = getSerpApiClient();
const stockData = await serpApiClient.fetchMultipleStocks(symbols);

// Process response
stockData.forEach((data, symbol) => {
  console.log(`${symbol}: ₹${data.price} (${data.changePercent}%)`);
});
```

## 🔄 Auto-refresh Implementation

```typescript
useEffect(() => {
  if (autoRefresh && portfolio.stocks.length > 0) {
    const interval = setInterval(fetchStockData, 15000); // 15 seconds
    return () => clearInterval(interval);
  }
}, [autoRefresh, fetchStockData]);
```

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailored layouts for different screen sizes
- **Touch-friendly**: Large buttons and touch targets
- **Horizontal Scrolling**: Tables scroll horizontally on mobile

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

### Environment Variables
```env
# SerpAPI Configuration
SERPAPI_KEY=your_serpapi_key_here

# Optional: Yahoo Finance backup
YAHOO_FINANCE_API_KEY=your_key_here
```

## ⚠️ Important Notes

### Data Accuracy Disclaimer
- Stock prices are fetched from unofficial sources
- Data may not reflect real-time market values
- Always verify with official sources before making investment decisions

### API Rate Limits
- **SerpAPI**: 100 searches/month on free plan, paid plans available
- **Yahoo Finance**: Unofficial libraries may have limitations (backup only)
- Implement proper error handling and fallbacks

### Legal Considerations
- **SerpAPI**: Official API service with proper terms of service
- Ensure compliance with SerpAPI usage policies
- Respect rate limits and usage policies
- Add appropriate disclaimers in the UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational and demonstration purposes. Please ensure compliance with data provider terms of service when using real APIs.

## 🆘 Support

For support and questions:
- Check the GitHub issues
- Review the documentation
- Ensure all dependencies are properly installed

---

**Disclaimer**: This application is for educational purposes only. Stock prices and financial data are indicative and should not be used for actual investment decisions. Always consult with financial advisors and verify data with official sources before making investment decisions.
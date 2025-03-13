// Configuration for Yahoo Finance MCP Tool

module.exports = {
  // Default stock symbol to search for if none is provided
  defaultSymbol: 'AAPL',
  
  // Trading simulator API endpoint where data will be sent
  tradingSimulatorEndpoint: 'https://your-trading-simulator.com/api/stock-data',
  
  // Yahoo Finance URL
  yahooFinanceBaseUrl: 'https://finance.yahoo.com/quote/',
  
  // Data points to extract (can be customized based on needs)
  dataPoints: [
    'regularMarketPrice',
    'previousClose',
    'open',
    'bid',
    'ask',
    'dayRange',
    'fiftyTwoWeekRange',
    'volume',
    'avgVolume',
    'marketCap',
    'beta',
    'peRatio',
    'eps',
    'earningsDate',
    'forwardDividend',
    'exDividendDate',
    'oneYearTargetEst'
  ],
  
  // Browser settings
  browser: {
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    timeout: 30000
  },
  
  // Retry settings
  retry: {
    maxAttempts: 3,
    delayMs: 1000
  }
};
// Yahoo Finance MCP Tool
// This script fetches stock data from Yahoo Finance and sends it to a trading simulator

// Configuration
const config = {
  // Default stock symbol to search for if none is provided
  defaultSymbol: 'AAPL',
  
  // Trading simulator API endpoint where data will be sent
  tradingSimulatorEndpoint: 'https://your-trading-simulator.com/api/stock-data',
  
  // Yahoo Finance URL
  yahooFinanceBaseUrl: 'https://finance.yahoo.com/quote/',
  
  // Data to extract (can be customized based on needs)
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
  ]
};

// Main MCP function
async function yahooFinanceMCP(symbol = config.defaultSymbol) {
  try {
    // Navigate to Yahoo Finance
    await page.goto(config.yahooFinanceBaseUrl + symbol);
    
    // Wait for the page to load
    await page.waitForSelector('[data-test="quote-header"]', { timeout: 10000 });
    
    console.log(`Successfully loaded Yahoo Finance page for ${symbol}`);
    
    // Extract stock data
    const stockData = await extractStockData(symbol);
    
    // Send data to trading simulator
    await sendDataToTradingSimulator(stockData);
    
    return {
      success: true,
      data: stockData,
      message: `Successfully fetched and sent data for ${symbol}`
    };
  } catch (error) {
    console.error(`Error in Yahoo Finance MCP: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to extract stock data from Yahoo Finance
async function extractStockData(symbol) {
  const stockData = {
    symbol,
    timestamp: new Date().toISOString(),
    data: {}
  };
  
  // Extract the quote summary data
  const quoteSummaryData = await page.evaluate(() => {
    // This function runs in the browser context
    const data = {};
    
    // Get the current price
    const priceElement = document.querySelector('[data-test="quote-header-price"]');
    if (priceElement) {
      data.currentPrice = priceElement.textContent.trim();
    }
    
    // Get other data points from the summary table
    const tableRows = document.querySelectorAll('table[data-test="quote-summary-table"] tr');
    tableRows.forEach(row => {
      const label = row.querySelector('td:first-child')?.textContent.trim();
      const value = row.querySelector('td:last-child')?.textContent.trim();
      
      if (label && value) {
        // Convert label to camelCase for consistent property naming
        const key = label.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/[^a-zA-Z0-9]+/g, '')
          .replace(/^[A-Z]/, firstChar => firstChar.toLowerCase());
        
        data[key] = value;
      }
    });
    
    return data;
  });
  
  stockData.data = quoteSummaryData;
  
  // Get historical data if available
  try {
    const historicalData = await page.evaluate(() => {
      const chartData = window.App?.main?.context?.dispatcher?.stores?.QuoteSummaryStore?.chartData;
      if (chartData && chartData.timestamp && chartData.close) {
        return {
          timestamps: chartData.timestamp,
          closePrices: chartData.close
        };
      }
      return null;
    });
    
    if (historicalData) {
      stockData.historicalData = historicalData;
    }
  } catch (error) {
    console.warn(`Could not extract historical data: ${error.message}`);
  }
  
  return stockData;
}

// Function to send data to the trading simulator
async function sendDataToTradingSimulator(stockData) {
  try {
    // Create a new page for the API call to avoid navigating away from Yahoo Finance
    const apiPage = await browser.newPage();
    
    // Send the data to the trading simulator API
    const response = await apiPage.evaluate(async (endpoint, data) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.text()
      };
    }, config.tradingSimulatorEndpoint, stockData);
    
    // Close the API page
    await apiPage.close();
    
    console.log(`Data sent to trading simulator. Response: ${response.status} ${response.statusText}`);
    
    return response;
  } catch (error) {
    console.error(`Error sending data to trading simulator: ${error.message}`);
    throw error;
  }
}

// Export the MCP function
module.exports = yahooFinanceMCP;
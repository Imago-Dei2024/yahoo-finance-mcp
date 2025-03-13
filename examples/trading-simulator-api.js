// Example Trading Simulator API
// This is a simple Express server that receives stock data from the Yahoo Finance MCP tool

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store received stock data
const stockDataStore = {};

// API endpoint to receive stock data
app.post('/api/stock-data', (req, res) => {
  try {
    const stockData = req.body;
    
    if (!stockData || !stockData.symbol) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid stock data. Symbol is required.' 
      });
    }
    
    console.log(`Received data for ${stockData.symbol}`);
    
    // Store the data
    stockDataStore[stockData.symbol] = {
      ...stockData,
      receivedAt: new Date().toISOString()
    };
    
    // Also save to a JSON file for persistence
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(dataDir, `${stockData.symbol}.json`),
      JSON.stringify(stockDataStore[stockData.symbol], null, 2)
    );
    
    return res.status(200).json({
      success: true,
      message: `Successfully received data for ${stockData.symbol}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing stock data:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing stock data',
      error: error.message
    });
  }
});

// API endpoint to get stored stock data
app.get('/api/stock-data/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  
  if (!stockDataStore[symbol]) {
    return res.status(404).json({
      success: false,
      message: `No data found for symbol ${symbol}`
    });
  }
  
  return res.status(200).json({
    success: true,
    data: stockDataStore[symbol]
  });
});

// API endpoint to list all available stock data
app.get('/api/stock-data', (req, res) => {
  const symbols = Object.keys(stockDataStore);
  
  return res.status(200).json({
    success: true,
    count: symbols.length,
    symbols,
    data: symbols.map(symbol => ({
      symbol,
      lastUpdated: stockDataStore[symbol].receivedAt,
      currentPrice: stockDataStore[symbol].data.currentPrice
    }))
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Trading Simulator API running on port ${PORT}`);
});

// Export for testing
module.exports = app;
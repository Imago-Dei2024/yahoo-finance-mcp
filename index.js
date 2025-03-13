// Yahoo Finance MCP Tool - Main Entry Point
const puppeteer = require('puppeteer');
const axios = require('axios');
const winston = require('winston');
const dotenv = require('dotenv');
const config = require('./config');
const yahooFinanceMCP = require('./yahoo_finance_mcp');

// Load environment variables
dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'yahoo-finance-mcp' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Main function to initialize and run the MCP
async function main() {
  let browser;
  
  try {
    logger.info('Starting Yahoo Finance MCP Tool');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: config.browser.headless,
      defaultViewport: config.browser.defaultViewport
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set page timeout
    page.setDefaultTimeout(config.browser.timeout);
    
    // Make browser and page available to the MCP function
    global.browser = browser;
    global.page = page;
    
    // Get stock symbol from command line arguments or use default
    const symbol = process.argv[2] || config.defaultSymbol;
    
    logger.info(`Processing stock symbol: ${symbol}`);
    
    // Run the MCP function
    const result = await yahooFinanceMCP(symbol);
    
    if (result.success) {
      logger.info(`Successfully processed ${symbol}`, { data: result.data });
    } else {
      logger.error(`Failed to process ${symbol}`, { error: result.error });
    }
  } catch (error) {
    logger.error('Error in main function', { error: error.message, stack: error.stack });
  } finally {
    // Close the browser
    if (browser) {
      await browser.close();
      logger.info('Browser closed');
    }
  }
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    logger.error('Unhandled error in main function', { error: error.message, stack: error.stack });
    process.exit(1);
  });
}

// Export for testing or programmatic use
module.exports = { main };
# Yahoo Finance MCP Tool

This is a Multi-Channel Processing (MCP) tool that fetches stock data from Yahoo Finance and sends it to a trading simulator website. The tool uses Puppeteer to scrape stock data from Yahoo Finance and then sends the data to a specified API endpoint.

## Features

- Fetches real-time stock data from Yahoo Finance
- Extracts key financial metrics (price, volume, market cap, etc.)
- Optionally retrieves historical data
- Sends data to a trading simulator API
- Configurable via environment variables or config file
- Detailed logging for monitoring and debugging

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/Imago-Dei2024/yahoo-finance-mcp.git
   cd yahoo-finance-mcp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file to configure your settings, especially the trading simulator API endpoint.

## Usage

### Basic Usage

Run the tool with a default stock symbol (AAPL if not configured otherwise):

```
npm start
```

### Specify a Stock Symbol

```
npm start -- MSFT
```

or

```
node index.js MSFT
```

### Programmatic Usage

You can also use this tool programmatically in your own code:

```javascript
const { main } = require('yahoo-finance-mcp');

// Run the MCP tool
main().catch(console.error);
```

## Configuration

You can configure the tool using environment variables (via `.env` file) or by editing the `config.js` file directly.

### Key Configuration Options

- `defaultSymbol`: The default stock symbol to use if none is provided
- `tradingSimulatorEndpoint`: The API endpoint where the stock data will be sent
- `yahooFinanceBaseUrl`: The base URL for Yahoo Finance
- `dataPoints`: The specific data points to extract from Yahoo Finance
- `browser`: Settings for the Puppeteer browser instance
- `retry`: Settings for retry logic

## How It Works

1. The tool launches a headless browser using Puppeteer
2. It navigates to the Yahoo Finance page for the specified stock symbol
3. It extracts the relevant stock data using DOM selectors
4. It sends the extracted data to the configured trading simulator API endpoint
5. It logs the results and closes the browser

## Customizing Data Extraction

You can customize which data points are extracted by modifying the `dataPoints` array in the `config.js` file. The tool will attempt to extract all specified data points from the Yahoo Finance page.

## Error Handling

The tool includes robust error handling and will retry failed operations according to the configured retry settings. All errors are logged to the console and to log files.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
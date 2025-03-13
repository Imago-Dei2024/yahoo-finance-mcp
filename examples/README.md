# Yahoo Finance MCP - Examples

This directory contains example code to help you get started with the Yahoo Finance MCP tool.

## Trading Simulator API

The `trading-simulator-api.js` file provides a simple Express server that can receive stock data from the Yahoo Finance MCP tool and make it available via a REST API.

### Features

- Receives stock data from the Yahoo Finance MCP tool
- Stores the data in memory and in JSON files
- Provides endpoints to retrieve the stored data
- Supports CORS for cross-origin requests

### Usage

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. The server will run on port 3000 by default (configurable via the PORT environment variable).

### API Endpoints

- `POST /api/stock-data`: Receives stock data from the Yahoo Finance MCP tool
- `GET /api/stock-data/:symbol`: Retrieves stored data for a specific stock symbol
- `GET /api/stock-data`: Lists all available stock data

## Trading Simulator Frontend

The `trading-simulator-frontend` directory contains a simple HTML/CSS/JavaScript frontend that can display stock data received from the Trading Simulator API.

### Features

- Search for stock symbols
- Display current price and price change
- Show key statistics
- Display a price chart (if historical data is available)
- Show all available data in a table

### Usage

1. Start the Trading Simulator API (see above)
2. Open the `index.html` file in a web browser
3. Enter a stock symbol and click "Search"

## Integration

To use these examples with the Yahoo Finance MCP tool:

1. Update the `config.js` file in the root directory to point to your Trading Simulator API endpoint:
   ```javascript
   tradingSimulatorEndpoint: 'http://localhost:3000/api/stock-data'
   ```

2. Run the Yahoo Finance MCP tool:
   ```
   cd ..
   npm start -- AAPL
   ```

3. The tool will fetch data for Apple Inc. (AAPL) and send it to your Trading Simulator API.

4. Open the Trading Simulator Frontend in your browser and search for "AAPL" to see the data.

## Customization

Feel free to customize these examples to fit your needs. Some ideas:

- Add authentication to the API
- Implement real-time updates using WebSockets
- Add more visualization options to the frontend
- Implement a portfolio management system
- Add trading simulation features (buy/sell orders, portfolio tracking, etc.)
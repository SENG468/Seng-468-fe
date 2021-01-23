import StockTrader from './Stock-Trader/index';
import StockTraderMock from './Stock-Trader-Mock/index';

let mockStockTrader = true; // Use env variables here
let stockTraderURL = ''; // Use env variables here
let api;

if (mockStockTrader) {
  api = new StockTraderMock();
} else {
  api = new StockTrader(`${stockTraderURL}`);
}

export { api }

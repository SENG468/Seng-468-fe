import StockTrader from './Stock-Trader/index';
import StockTraderMock from './Stock-Trader-Mock/index';

let mockStockTrader = false; // Use env variables here
let stockTraderURL = 'http://localhost:8080/stock-trade'; // Use env variables here
let api;

const getToken = () => {
  const tokenString = sessionStorage.getItem('access_token');
  const userToken = JSON.parse(tokenString);
  return userToken?.access_token
};

if (mockStockTrader) {
  api = new StockTraderMock();
} else {
  api = new StockTrader(`${stockTraderURL}`, getToken());
}

export { api }

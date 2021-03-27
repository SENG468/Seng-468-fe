export default class StockTrader {

  constructor(url, jwt) {
    this.baseUrl = url;
    this.jwt = jwt;
  }

  updateToken = () => {
    const tokenString = sessionStorage.getItem('access_token');
    const userToken = JSON.parse(tokenString);
    this.jwt = userToken.access_token;
  }

  headers = (headers) => {
    return this.jwt ? {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
      authorization: `${this.jwt}`,
    } : headers;
  }

  userLogin = async (credentials) => {
    const url = `${this.baseUrl}/users/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: JSON.stringify(credentials)
    });
    return handleErrors(response);
  }

  userSignup = async (credentials) => {
    const url = `${this.baseUrl}/users/sign-up`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({"Content-Type": "application/json; charset=utf-8"}),
      body: JSON.stringify(credentials)
    });
    return handleErrors(response);
  }

  getQuote = async (stockSym) => {
    const url = `${this.baseUrl}/quote/${stockSym}?transactionId=1`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers({})
    });
    return handleErrors(response);
  }

  getAccount = async () => {
    const url = `${this.baseUrl}/accounts/me`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers({})
    });
    return handleErrors(response);
  }

  getSummary = async () => {
    const url = `${this.baseUrl}/accounts/displaySummary?transactionId=1`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers({})
    });
    return handleErrors(response);
  }

  addFunds = async (username, amount) => {
    const body = {
      'name' : username,
      'balance' : amount,
    }
    const url = `${this.baseUrl}/accounts/add`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: JSON.stringify(body)
    });
    return handleErrors(response);
  }

  submitSimpleOrder = async (type, symbol, amount) => {
    const body = {
      'type' : type,
      'stockCode' : symbol,
      'cashAmount': amount
    }
    const url = `${this.baseUrl}/order/simple`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: JSON.stringify(body)
    });
    return handleErrors(response);
  }

  commitSimpleBuy = async () => {
    const body = {}
    const url = `${this.baseUrl}/buy/commit`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: JSON.stringify(body)
    });
    return handleErrors(response);
  }

  cancelSimpleBuy = async () => {
    const body = {}
    const url = `${this.baseUrl}/buy/cancel`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: JSON.stringify(body)
    });
    return handleErrors(response);
  }

  cancelTrigger = async (type, symbol) => {
    const body = {};
    const cancelType = type === 'BUY_AT' ? 'setBuy' : 'setSell';
    const url = `${this.baseUrl}/${cancelType}/cancel/${symbol}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: JSON.stringify(body)
    });
    return handleErrors(response);
  }
}

function handleErrors(response) {
    if(!response.ok) throw new Error(response.statusText);
    return response.json();
}


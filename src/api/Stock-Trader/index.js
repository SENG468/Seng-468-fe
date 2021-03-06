export default class StockTrader {

  constructor(url, jwt) {
    this.baseUrl = url;
    this.jwt = jwt;
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

  getAccount = async () => {
    const url = `${this.baseUrl}/accounts/me`;
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

}

function handleErrors(response) {
    if(!response.ok) throw new Error(response.statusText);
    return response.json();
}


export default class StockTrader {

  constructor(url, jwt) {
    this.baseUrl = url;
    this.jwt = jwt;
  }

  headers = (headers) => {
    return this.jwt ? {
      ...headers,
      authorization: `Bearer ${this.jwt}`,
    } : headers;
  }

  userLogin = async (credentials) => {
    const url = `${this.baseUrl}/use-real-endpoint-url-here`; // This is temporary until we have actual endpoints
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: credentials // temp until endpoints are finalized
    });
    return await response.json();
  }

  handleCreation = async (credentials) => {
    const url = `${this.baseUrl}/use-real-endpoint-url-here`; // This is temporary until we have actual endpoints
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers({}),
      body: credentials // temp until endpoints are finalized
    });
    return await response.json();
  }

}

export class HttpClientRequestError extends Error {
  constructor() {
    super('Request failed');
    this.name = 'HttpClientRequestError';
  }
}

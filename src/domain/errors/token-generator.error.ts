export class TokenGeneratorError extends Error {
  constructor() {
    super('Failed to generate token');
    this.name = 'TokenGeneratorError';
  }
}

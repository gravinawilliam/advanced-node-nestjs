export class UuidGeneratorError extends Error {
  constructor() {
    super('Failed to generate uuid');
    this.name = 'UuidGeneratorError';
  }
}

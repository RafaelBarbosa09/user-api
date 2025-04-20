export class InvalidInputDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputDataError';
  }
}

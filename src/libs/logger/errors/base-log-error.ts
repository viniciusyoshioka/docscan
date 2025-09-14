export class BaseLogError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = BaseLogError.name
  }
}

export class BaseDatabaseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "BaseDatabaseError"
  }
}

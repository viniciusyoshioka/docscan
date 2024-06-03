export class UnknownLogError extends Error {
  constructor(message?: string, option?: ErrorOptions) {
    super(message, option)
    this.name = "UnknownLogError"
  }
}

export class UnknowLogError extends Error {
  constructor(message?: string, option?: ErrorOptions) {
    super(message, option)
    this.name = "UnknowLogError"
  }
}

export class DocumentNotOpenError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "DocumentNotOpenError"
  }
}

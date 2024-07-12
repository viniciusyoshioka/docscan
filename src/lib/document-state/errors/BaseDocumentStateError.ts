export class BaseDocumentStateError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "BaseDocumentStateError"
  }
}

export class NoPicturesAvaialbleError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    message = message ?? "There is no pictures in the document to be converted to PDF"
    super(message, options)
    this.name = "NoPicturesAvaialbleError"
  }
}

export class FileNotExistsError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    message = message ?? "Cannot access file because it does not exist"
    super(message, options)
    this.name = "FileNotExistsError"
  }
}

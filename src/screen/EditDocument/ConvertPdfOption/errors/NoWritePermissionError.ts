export class NoWritePermissionError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    message = message ?? "Write permission to internal storage was not granted"
    super(message, options)
    this.name = "NoWritePermissionError"
  }
}

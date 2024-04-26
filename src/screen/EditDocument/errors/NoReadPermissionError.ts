export class NoReadPermissionError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    message = message ?? "Read permission to internal storage was not granted"
    super(message, options)
    this.name = "NoReadPermissionError"
  }
}

import { BaseDatabaseError } from "./BaseDatabaseError"


export class UnknownDatabaseError extends BaseDatabaseError {
  constructor(message: string, options?: ErrorOptions) {
    const errorMessage = `Unknown database error: ${message}`
    super(errorMessage, options)
    this.name = "UnknownDatabaseError"
  }
}

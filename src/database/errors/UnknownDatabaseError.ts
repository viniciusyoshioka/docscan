import { BaseDatabaseError } from "./BaseDatabaseError"


export class UnknownDatabaseError extends BaseDatabaseError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "UnknownDatabaseError"
  }
}

import { BaseDatabaseError } from "./BaseDatabaseError"


export class OpenDatabaseError extends BaseDatabaseError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "OpenDatabaseError"
  }
}

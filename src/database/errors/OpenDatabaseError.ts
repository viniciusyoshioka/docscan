import { BaseDatabaseError } from "./BaseDatabaseError"


export class OpenDatabaseError extends BaseDatabaseError {


  protected databaseName: string


  constructor(databaseName: string, message: string, options?: ErrorOptions) {
    const errorMessage = `Failed to open ${databaseName} database: ${message}`
    super(errorMessage, options)
    this.name = "OpenDatabaseError"
    this.databaseName = databaseName
  }


  getDatabaseName(): string {
    return this.databaseName
  }
}

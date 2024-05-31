import { BaseDatabaseError } from "./BaseDatabaseError"


export class OpenDatabaseError extends BaseDatabaseError {


  protected _databaseName: string


  constructor(databaseName: string, message: string, options?: ErrorOptions) {
    const errorMessage = `Failed to open ${databaseName} database: ${message}`
    super(errorMessage, options)
    this.name = "OpenDatabaseError"
    this._databaseName = databaseName
  }


  get databaseName(): string {
    return this._databaseName
  }
}

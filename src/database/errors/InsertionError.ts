import { BaseDatabaseError } from "./BaseDatabaseError"


export class InsertionError extends BaseDatabaseError {


  protected entity: string


  constructor(entity: string, message: string, options?: ErrorOptions) {
    const errorMessage = `Failed to insert data for ${entity}: ${message}`
    super(errorMessage, options)
    this.name = "InsertionError"
    this.entity = entity
  }


  getEntity(): string {
    return this.entity
  }
}

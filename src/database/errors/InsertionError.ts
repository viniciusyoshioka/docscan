import { BaseDatabaseError } from "./BaseDatabaseError"


export class InsertionError extends BaseDatabaseError {


  protected entity: string


  constructor(entity: string, options?: ErrorOptions) {
    const errorMessage = `Failed to insert data for ${entity}`
    super(errorMessage, options)
    this.name = "InsertionError"
    this.entity = entity
  }


  getEntity(): string {
    return this.entity
  }
}

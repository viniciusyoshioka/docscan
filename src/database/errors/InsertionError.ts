import { BaseDatabaseError } from "./BaseDatabaseError"


export class InsertionError extends BaseDatabaseError {


  protected _entity: string


  constructor(entity: string, options?: ErrorOptions) {
    const errorMessage = `Failed to insert data for ${entity}`
    super(errorMessage, options)
    this.name = "InsertionError"
    this._entity = entity
  }


  get entity(): string {
    return this._entity
  }
}

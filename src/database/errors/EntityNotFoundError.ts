import { BaseDatabaseError } from "./BaseDatabaseError"


export class EntityNotFoundError extends BaseDatabaseError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = EntityNotFoundError.name
  }
}

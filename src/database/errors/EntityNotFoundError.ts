import { EmptyObject } from "type-fest"

import { IdOf } from "../types"
import { BaseDatabaseError } from "./BaseDatabaseError"


export class EntityNotFoundError<E = EmptyObject> extends BaseDatabaseError {


  protected entity: string
  protected id: IdOf<E>


  constructor(entity: string, id: IdOf<E>, options?: ErrorOptions) {
    const errorMessage = `${entity} with id ${id} not found`
    super(errorMessage, options)
    this.name = "EntityNotFoundError"
    this.entity = entity
    this.id = id
  }


  getEntity(): string {
    return this.entity
  }

  getId(): IdOf<E> {
    return this.id
  }
}

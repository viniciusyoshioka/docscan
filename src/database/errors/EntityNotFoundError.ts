import { EmptyObject } from "type-fest"

import { IdOf } from "../types"
import { BaseDatabaseError } from "./BaseDatabaseError"


export class EntityNotFoundError<E = EmptyObject> extends BaseDatabaseError {


  protected _entity: string
  protected _id: IdOf<E>


  constructor(entity: string, id: IdOf<E>, options?: ErrorOptions) {
    const errorMessage = `${entity} with id ${id} not found`
    super(errorMessage, options)
    this.name = "EntityNotFoundError"
    this._entity = entity
    this._id = id
  }


  get entity(): string {
    return this._entity
  }

  get id(): IdOf<E> {
    return this._id
  }
}

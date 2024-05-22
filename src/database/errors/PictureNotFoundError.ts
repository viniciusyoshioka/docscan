import { Picture } from "../entities"
import { IdOf } from "../types"
import { BaseDatabaseError } from "./BaseDatabaseError"


export class PictureNotFoundError extends BaseDatabaseError {


  private pictureId: IdOf<Picture>


  constructor(id: IdOf<Picture>, message?: string, options?: ErrorOptions) {
    const errorMessage = message ?? `Picture with id ${id} not found`
    super(errorMessage, options)
    this.name = "PictureNotFoundError"
    this.pictureId = id
  }


  public getPictureId(): IdOf<Picture> {
    return this.pictureId
  }
}

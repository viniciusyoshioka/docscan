import { DocumentPicture } from "../../entities"
import { IdOf } from "../../types"


export class DocumentPictureNotFoundError extends Error {


  private documentPictureId: IdOf<DocumentPicture>


  constructor(
    documentPictureId: IdOf<DocumentPicture>,
    message?: string,
    options?: ErrorOptions
  ) {
    const errorMessage = message
      ?? `Document picture with id ${documentPictureId} not found`
    super(errorMessage, options)
    this.name = "DocumentPictureNotFoundError"
    this.documentPictureId = documentPictureId
  }


  public getDocumentPictureId(): IdOf<DocumentPicture> {
    return this.documentPictureId
  }
}

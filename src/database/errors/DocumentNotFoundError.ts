import { Document } from "../entities"
import { IdOf } from "../types"


export class DocumentNotFoundError extends Error {


  private documentId: IdOf<Document>


  constructor(
    documentId: IdOf<Document>,
    message?: string,
    options?: ErrorOptions
  ) {
    const errorMessage = message ?? `Document with id ${documentId} not found`
    super(errorMessage, options)
    this.name = "DocumentNotFoundError"
    this.documentId = documentId
  }


  public getDocumentId(): IdOf<Document> {
    return this.documentId
  }
}

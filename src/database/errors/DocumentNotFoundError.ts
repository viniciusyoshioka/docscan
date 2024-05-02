import { Document } from "../entities"
import { IdOf } from "../types"


export class DocumentNotFoundError extends Error {


  private documentId: IdOf<Document>


  constructor(id: IdOf<Document>, message?: string, options?: ErrorOptions) {
    const errorMessage = message ?? `Document with id ${id} not found`
    super(errorMessage, options)
    this.name = "DocumentNotFoundError"
    this.documentId = id
  }


  public getDocumentId(): IdOf<Document> {
    return this.documentId
  }
}

import { Document } from "../entities"
import { IdOf } from "../types"
import { BaseDatabaseError } from "./BaseDatabaseError"


export class DocumentNotFoundError extends BaseDatabaseError {


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

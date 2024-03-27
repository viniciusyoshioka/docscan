import { Document } from "../../entities"
import { WithId } from "../../types"


export class DocumentNotFoundError extends Error {


  private documentId: WithId<Document>["id"]


  constructor(
    documentId: WithId<Document>["id"],
    message?: string,
    options?: ErrorOptions
  ) {
    const errorMessage = message ?? `Document with id ${documentId} not found`
    super(errorMessage, options)
    this.name = "DocumentNotFoundError"
    this.documentId = documentId
  }


  public getDocumentId(): WithId<Document>["id"] {
    return this.documentId
  }
}

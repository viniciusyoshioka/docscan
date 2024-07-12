import { BaseDocumentStateError } from "./BaseDocumentStateError"


export class DocumentNotSavedError extends BaseDocumentStateError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "DocumentNotSavedError"
  }
}

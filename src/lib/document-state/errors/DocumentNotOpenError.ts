import { BaseDocumentStateError } from "./BaseDocumentStateError"


export class DocumentNotOpenError extends BaseDocumentStateError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "DocumentNotOpenError"
  }
}

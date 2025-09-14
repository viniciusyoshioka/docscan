import { BaseDocumentStateError } from "./BaseDocumentStateError"


export class DocumentAlreadyOpenError extends BaseDocumentStateError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = DocumentAlreadyOpenError.name
  }
}

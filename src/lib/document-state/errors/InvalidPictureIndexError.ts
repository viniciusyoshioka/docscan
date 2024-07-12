import { BaseDocumentStateError } from "./BaseDocumentStateError"


export class InvalidPictureIndexError extends BaseDocumentStateError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "InvalidPictureIndexError"
  }
}

import { DocumentNotOpenError } from "../../errors"
import { DocumentStateActionFunction } from "../types"


export const renameDocument: DocumentStateActionFunction<"renameDocument"> = (state, payload) => {
  if (!state) {
    throw new DocumentNotOpenError("Cannot rename a document that is not open")
  }

  const { pictures } = state
  const { document } = payload

  return { document, pictures }
}

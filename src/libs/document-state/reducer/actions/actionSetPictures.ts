import { DocumentNotOpenError, DocumentNotSavedError } from "../../errors"
import { DocumentStateActionFunction } from "../types"


export const setPictures: DocumentStateActionFunction<"setPictures"> = (state, payload) => {
  if (!state) {
    throw new DocumentNotOpenError("Cannot set pictures of a document that is not open")
  }
  if (!state.document.id) {
    throw new DocumentNotSavedError("Cannot set pictures of a document that is not saved")
  }

  const { document } = state
  const { pictures } = payload

  return { document, pictures }
}

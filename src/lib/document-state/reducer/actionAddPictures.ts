import { DocumentNotOpenError, DocumentNotSavedError } from "../errors"
import { DocumentStateActionFunction } from "./types"


export const addPictures: DocumentStateActionFunction<"addPictures"> =
  (state, payload) => {
    if (!state) {
      throw new DocumentNotOpenError("Document must be opened before adding pictures")
    }
    if (state.document.id === undefined) {
      throw new DocumentNotSavedError("Document must be saved before adding pictures")
    }

    return {
      document: state.document,
      pictures: [...state.pictures, ...payload.pictures],
    }
  }

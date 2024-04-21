import { DocumentNotOpenError, DocumentNotSavedError } from "../errors"
import { DocumentStateActionFunction } from "./types"


export const addPicture: DocumentStateActionFunction<"addPicture"> =
  (state, payload) => {
    if (!state) {
      throw new DocumentNotOpenError("Document must be opened before adding a picture")
    }
    if (state.document.id === undefined) {
      throw new DocumentNotSavedError("Document must be saved before adding a picture")
    }

    return {
      document: state.document,
      pictures: [...state.pictures, payload.picture],
    }
  }

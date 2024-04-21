import { DocumentNotOpenError } from "../errors"
import { DocumentStateActionFunction } from "./types"


export const updateDocument: DocumentStateActionFunction<"updateDocument"> =
  (state, payload) => {
    if (!state) {
      throw new DocumentNotOpenError("Document must be opened before updating it")
    }

    return {
      document: payload.document,
      pictures: state.pictures,
    }
  }

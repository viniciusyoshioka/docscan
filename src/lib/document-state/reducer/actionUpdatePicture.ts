import {
  DocumentNotOpenError,
  DocumentNotSavedError,
  InvalidPictureIndexError,
} from "../errors"
import { DocumentStateActionFunction } from "./types"


export const updatePicture: DocumentStateActionFunction<"updatePicture"> =
  (state, payload) => {
    if (!state) {
      throw new DocumentNotOpenError("Document must be opened before updating a picture")
    }
    if (state.document.id === undefined) {
      throw new DocumentNotSavedError(
        "Document should not have a picture without being saved first. This is a bug."
      )
    }
    if (payload.pictureIndex < 0) {
      throw new InvalidPictureIndexError("Index must be greater than or equal to 0")
    }
    if (payload.pictureIndex >= state.pictures.length) {
      throw new InvalidPictureIndexError("Index must be less than the number of pictures")
    }

    const newPictures = state.pictures.slice()
    newPictures[payload.pictureIndex] = payload.picture

    return {
      document: state.document,
      pictures: newPictures,
    }
  }

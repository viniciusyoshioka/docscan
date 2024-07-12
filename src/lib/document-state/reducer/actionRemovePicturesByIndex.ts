import {
  DocumentNotOpenError,
  DocumentNotSavedError,
  InvalidPictureIndexError,
} from "../errors"
import { DocumentStateActionFunction } from "./types"


export const removePicturesByIndex: DocumentStateActionFunction<"removePicturesByIndex"> =
  (state, payload) => {
    if (!state) {
      throw new DocumentNotOpenError("Document must be opened before removing pictures")
    }
    if (state.document.id === undefined) {
      throw new DocumentNotSavedError(
        "Document should not have pictures without being saved first. This is a bug."
      )
    }

    payload.picturesIndex.forEach(item => {
      if (item < 0) {
        throw new InvalidPictureIndexError("Index must be greater than or equal to 0")
      }
      if (item >= state.pictures.length) {
        throw new InvalidPictureIndexError(
          "Index must be less than the number of pictures"
        )
      }
    })

    const indexToRemove = new Set(payload.picturesIndex)
    const newPictures = state.pictures.filter((_, index) => {
      return !indexToRemove.has(index)
    })

    return {
      document: state.document,
      pictures: newPictures,
    }
  }

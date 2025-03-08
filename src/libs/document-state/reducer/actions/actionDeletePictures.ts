import { DocumentNotOpenError, DocumentNotSavedError } from "../../errors"
import { DocumentStateActionFunction } from "../types"


export const deletePictures: DocumentStateActionFunction<"deletePictures"> = (state, payload) => {
  if (!state) {
    throw new DocumentNotOpenError("Cannot delete pictures from a document that is not open")
  }
  if (!state.document.id) {
    throw new DocumentNotSavedError("Cannot delete pictures from a document that is not saved")
  }

  const { document, pictureIds } = payload

  const pictures = state.pictures.filter(picture => {
    return !pictureIds.includes(picture.id)
  })

  return { document, pictures }
}

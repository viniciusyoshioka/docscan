import { DocumentNotOpenError, DocumentNotSavedError } from "../../errors"
import { DocumentStateActionFunction } from "../types"


export const replacePicture: DocumentStateActionFunction<"replacePicture"> = (state, payload) => {
  if (!state) {
    throw new DocumentNotOpenError("Cannot replace picture in a document that is not open")
  }
  if (!state.document.id) {
    throw new DocumentNotSavedError("Cannot replace picture in a document that is not saved")
  }

  const { document } = payload
  const pictureToReplace = payload.picture

  const pictures = state.pictures.map(picture => {
    if (picture.id === pictureToReplace.id) {
      return pictureToReplace
    }
    return picture
  })

  return { document, pictures }
}

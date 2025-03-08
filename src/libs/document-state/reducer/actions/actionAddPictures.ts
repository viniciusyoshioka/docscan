import { DocumentNotOpenError } from "../../errors"
import { DocumentStateActionFunction } from "../types"


export const addPictures: DocumentStateActionFunction<"addPictures"> = (state, payload) => {
  if (!state) {
    throw new DocumentNotOpenError("Cannot add pictures to a document that is not open")
  }

  const currentPictures = state.pictures
  const picturesToAdd = payload.pictures
  const pictures = [...currentPictures, ...picturesToAdd]

  const { document } = payload

  return { document, pictures }
}

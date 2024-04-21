import { addPicture } from "./actionAddPicture"
import { addPictures } from "./actionAddPictures"
import { close } from "./actionClose"
import { createNewIfEmpty } from "./actionCreateNewIfEmpty"
import { removePictureByIndex } from "./actionRemovePictureByIndex"
import { removePicturesByIndex } from "./actionRemovePicturesByIndex"
import { set } from "./actionSet"
import { updateDocument } from "./actionUpdateDocument"
import { updatePicture } from "./actionUpdatePicture"
import {
  DocumentStateActionFunction,
  DocumentStateActionsMap,
  DocumentStateReducer,
} from "./types"


const actionsMap: DocumentStateActionsMap = {
  createNewIfEmpty,
  close,
  set,
  updateDocument,
  addPicture,
  addPictures,
  removePictureByIndex,
  removePicturesByIndex,
  updatePicture,
}


export const documentStateReducer: DocumentStateReducer = (state, action) => {
  const actionFunction = actionsMap[action.type] as DocumentStateActionFunction
  return actionFunction(state, action.payload)
}

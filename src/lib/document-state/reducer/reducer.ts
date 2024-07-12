import { addPictures } from "./actionAddPictures"
import { close } from "./actionClose"
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
  close,
  set,
  updateDocument,
  addPictures,
  removePicturesByIndex,
  updatePicture,
}


export const documentStateReducer: DocumentStateReducer = (state, action) => {
  const actionFunction = actionsMap[action.type] as DocumentStateActionFunction
  return actionFunction(state, action.payload)
}

import {
  addPictures,
  close,
  deletePictures,
  openDocument,
  renameDocument,
  replacePicture,
  setPictures,
} from "./actions"
import {
  DocumentStateActionFunction,
  DocumentStateActionsMap,
  DocumentStateReducer,
} from "./types"


const actionsMap: DocumentStateActionsMap = {
  close,
  openDocument,
  renameDocument,
  setPictures,
  addPictures,
  replacePicture,
  deletePictures,
}


export const documentStateReducer: DocumentStateReducer = (state, action) => {
  const actionFunction = actionsMap[action.type] as DocumentStateActionFunction
  return actionFunction(state, action.payload)
}

import { SetOptional } from "type-fest"

import { Document, IdOf, WithId, useDatabase } from "@database"
import {
  DocumentManagerBaseActionParams,
  DocumentManagerCommonActionParams,
} from "./manager"
import { addPicture } from "./manager/actionAddPicture"
import { addPictures } from "./manager/actionAddPictures"
import { close } from "./manager/actionClose"
import { open } from "./manager/actionOpen"
import { removePictureByIndex } from "./manager/actionRemovePictureByIndex"
import { removePicturesByIndex } from "./manager/actionRemovePicturesByIndex"
import { updateDocument } from "./manager/actionUpdateDocument"
import { updatePicture } from "./manager/actionUpdatePicture"
import { useDocumentState } from "./useDocumentState"


export function useDocumentManager() {


  const { documentModel, documentPictureModel } = useDatabase()
  const { documentState, updateDocumentState } = useDocumentState()


  const baseParams: DocumentManagerCommonActionParams = {
    documentModel,
    documentPictureModel,
    documentState,
    updateDocumentState,
  }


  return {
    close: () => {
      close(baseParams, undefined)
    },
    open: (documentId: IdOf<Document>) => {
      open(baseParams, { documentId })
    },
    addPicture: (picturePath: string) => {
      addPicture(baseParams, { picturePath })
    },
    addPictures: (picturesPath: string[]) => {
      addPictures(baseParams, { picturesPath })
    },
    removePictureByIndex: (pictureIndex: number) => {
      removePictureByIndex(baseParams, { pictureIndex })
    },
    removePicturesByIndex: (picturesIndex: number[]) => {
      removePicturesByIndex(baseParams, { picturesIndex })
    },
    updateDocument: (document: SetOptional<WithId<Document>, "id">) => {
      updateDocument(baseParams, { document })
    },
    updatePicture: (picture: DocumentManagerBaseActionParams["updatePicture"]) => {
      updatePicture(baseParams, picture)
    },
  }
}

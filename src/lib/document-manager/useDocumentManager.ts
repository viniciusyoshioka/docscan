import { useCallback, useMemo } from "react"
import { SetOptional } from "type-fest"

import { Document, IdOf, Picture, WithId, useModels } from "@database"
import {
  DocumentManagerActionReturnType,
  DocumentManagerCommonActionParams,
  actionAddPictures,
  actionOpen,
  actionRemovePictures,
  actionUpdateDocument,
  actionUpdatePicture,
} from "./manager"


export type DocumentManager = {
  open: (
    documentId: IdOf<Document>
  ) => Promise<DocumentManagerActionReturnType["open"]>

  updateDocument: (
    document: SetOptional<WithId<Document>, "id">
  ) => Promise<DocumentManagerActionReturnType["updateDocument"]>

  addPictures: (
    document: SetOptional<WithId<Document>, "id">,
    picturesPath: string[]
  ) => Promise<DocumentManagerActionReturnType["addPictures"]>

  removePictures: (
    document: WithId<Document>,
    picturesId: IdOf<Picture>[]
  ) => Promise<DocumentManagerActionReturnType["removePictures"]>

  updatePicture: (
    document: WithId<Document>,
    picture: WithId<Picture>
  ) => Promise<DocumentManagerActionReturnType["updatePicture"]>
}


export function useDocumentManager(): DocumentManager {


  const { documentModel, pictureModel } = useModels()


  const baseParams: DocumentManagerCommonActionParams = useMemo(() => ({
    documentModel,
    pictureModel,
  }), [documentModel, pictureModel])


  const open: DocumentManager["open"] = useCallback(
    async documentId => {
      return await actionOpen(baseParams, { documentId })
    },
    [baseParams]
  )

  const updateDocument: DocumentManager["updateDocument"] = useCallback(
    async document => {
      return await actionUpdateDocument(baseParams, { document })
    },
    [baseParams]
  )

  const addPictures: DocumentManager["addPictures"] = useCallback(
    async (document, picturesPath) => {
      return await actionAddPictures(baseParams, { document, picturesPath })
    },
    [baseParams]
  )
  const removePictures: DocumentManager["removePictures"] = useCallback(
    async (document, picturesId) => {
      return await actionRemovePictures(baseParams, { document, picturesId })
    },
    [baseParams]
  )
  const updatePicture: DocumentManager["updatePicture"] = useCallback(
    async (document, picture) => {
      return await actionUpdatePicture(baseParams, { document, picture })
    },
    [baseParams]
  )


  return {
    open,
    updateDocument,
    addPictures,
    removePictures,
    updatePicture,
  }
}

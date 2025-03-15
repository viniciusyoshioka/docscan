import { useCallback, useState } from "react"

import { EntityId, useEntityModels } from "@database"
import { DocumentService } from "@services/document"
import { normalizeError, PictureUtils } from "@utils"


interface DeleteDocumentsParams {
  getSelectedDocumentIds: () => EntityId[]
  onSuccess: () => void
  onError: (error: Error) => void
}


interface DeleteDocuments {
  isLoading: boolean
  deleteDocuments: () => Promise<void>
}


export function useDeleteDocuments(params: DeleteDocumentsParams): DeleteDocuments {


  const { documentModel, pictureModel } = useEntityModels()

  const [isLoading, setIsLoading] = useState(false)


  const deleteDocuments = useCallback(async () => {
    const documentIds = params.getSelectedDocumentIds()
    const allFileNamesToDelete: string[] = []

    try {
      setIsLoading(true)

      await documentModel.transaction(async tx => {
        const fileNamesToDelete = await pictureModel.getFileNamesByDocumentIds(documentIds, tx)
        allFileNamesToDelete.push(...fileNamesToDelete)

        await pictureModel.deleteByDocumentIds(documentIds, tx)
        await documentModel.deleteByIds(documentIds, tx)
      })

      const picturePathsToDelete = allFileNamesToDelete.map(fileName => {
        return PictureUtils.getPicturePathForFileName(fileName)
      })
      DocumentService.deletePicturesService({
        pictures: picturePathsToDelete,
      })

      setIsLoading(false)
      params.onSuccess()
    } catch (error) {
      setIsLoading(false)

      const errorInstance = normalizeError(error)
      params.onError(errorInstance)
    }
  }, [
    params.getSelectedDocumentIds,
    documentModel,
    pictureModel,
    params.onSuccess,
    params.onError,
  ])


  return {
    isLoading,
    deleteDocuments,
  }
}

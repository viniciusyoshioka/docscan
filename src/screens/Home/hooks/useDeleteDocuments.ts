import { useCallback, useMemo, useState } from 'react'

import type { DocumentId } from '@database'
import { useServices } from '@database'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'


interface DeleteDocumentsParams {
  getSelectedDocumentIds: () => DocumentId[]
  onSuccess: () => void
  onError: (error: Error) => void
}


interface DeleteDocuments {
  isLoading: boolean
  deleteDocuments: () => Promise<void>
}


// TODO: Rename to useDeleteSelectedDocuments/deleteSelectedDocuments
export function useDeleteDocuments(
  params: DeleteDocumentsParams,
): DeleteDocuments {


  const { documentService, pictureService } = useServices()
  const logger = useLogger()

  const [isLoading, setIsLoading] = useState(false)


  const deleteDocumentsFunction = useCallback(async () => {
    const documentIds = params.getSelectedDocumentIds()

    try {
      setIsLoading(true)

      for (let i = 0; i < documentIds.length; i++) {
        const documentId = documentIds[i]

        await documentService.transaction(async tx => {
          const fileNames = await pictureService.findFileNamesByDocumentId(
            documentId,
            tx,
          )

          await pictureService.deleteByDocumentId(documentId, tx)
          // TODO: Add `fileNames` to delete through a NativeModule

          await documentService.deleteById(documentId, tx)
        })
      }

      setIsLoading(false)
      params.onSuccess()
    } catch (error) {
      setIsLoading(false)

      const errorInstance = normalizeError(error)
      const errorStack = getErrorStackTrace(error)
      const errorMessage = stringifyError(error)

      await logger.error(
        `Error deleting selected documents: "${errorMessage}"`,
        errorStack,
      )
      params.onError(errorInstance)
    }
  }, [
    params.getSelectedDocumentIds,
    documentService,
    pictureService,
    params.onSuccess,
    logger,
    params.onError,
  ])


  const deleteDocuments = useMemo<DeleteDocuments>(() => ({
    isLoading,
    deleteDocuments: deleteDocumentsFunction,
  }), [isLoading, deleteDocumentsFunction])


  return deleteDocuments
}

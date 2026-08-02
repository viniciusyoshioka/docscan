import { useCallback, useMemo, useState } from 'react'

import type { DocumentId } from '@database'
import { useServices } from '@database'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError } from '@utils'
import { useShowErrorDeletingSelectedDocumentsAlert } from './useShowErrorDeletingSelectedDocumentsAlert.ts'


interface DeleteSelectedDocumentsParams {
  getSelectedDocumentIds: () => DocumentId[]
  onSuccess?: () => void
  onError?: (error: Error) => void
}


interface DeleteSelectedDocuments {
  isLoading: boolean
  deleteSelectedDocuments: () => Promise<void>
}


export function useDeleteSelectedDocuments(
  params: DeleteSelectedDocumentsParams,
): DeleteSelectedDocuments {
  const { getSelectedDocumentIds, onSuccess, onError } = params


  const { documentService, pictureService } = useServices()
  const logger = useLogger()

  const [isLoading, setIsLoading] = useState(false)

  const showErrorDeletingSelectedDocumentsAlert =
    useShowErrorDeletingSelectedDocumentsAlert()


  const deleteSelectedDocumentsFunction = useCallback(async () => {
    const selectedDocumentIds = getSelectedDocumentIds()

    try {
      setIsLoading(true)

      for (let i = 0; i < selectedDocumentIds.length; i++) {
        const documentId = selectedDocumentIds[i]

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
      onSuccess?.()
    } catch (error) {
      setIsLoading(false)

      const errorInstance = normalizeError(error)
      const errorMessage = errorInstance.message
      const errorStack = getErrorStackTrace(errorInstance)

      await logger.error(
        `Error deleting selected documents: "${errorMessage}"`,
        errorStack,
      )
      showErrorDeletingSelectedDocumentsAlert()
      onError?.(errorInstance)
    }
  }, [
    getSelectedDocumentIds,
    documentService,
    pictureService,
    onSuccess,
    logger,
    onError,
  ])


  const deleteSelectedDocuments = useMemo<DeleteSelectedDocuments>(() => ({
    isLoading,
    deleteSelectedDocuments: deleteSelectedDocumentsFunction,
  }), [isLoading, deleteSelectedDocumentsFunction])


  return deleteSelectedDocuments
}

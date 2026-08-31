import { useCallback, useMemo, useState } from 'react'

import type { DocumentId } from '@database'
import { useServices } from '@database'
import { Namespaces, useLocale } from '@locale'
import { AlertType, useAlert } from '@modules/alert'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError } from '@utils'


interface DeleteSelectedDocumentsParams {
  getSelectedDocumentIds: () => DocumentId[]
  exitSelection: () => void
  onSuccess?: () => void
}


interface DeleteSelectedDocuments {
  isLoading: boolean
  deleteSelectedDocuments: () => void
}


export function useDeleteSelectedDocuments(
  params: DeleteSelectedDocumentsParams,
): DeleteSelectedDocuments {
  const { getSelectedDocumentIds, exitSelection, onSuccess } = params


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()
  const { documentService, pictureService } = useServices()

  const [isLoading, setIsLoading] = useState(false)


  const deletingSelectedDocumentsAlert = useMemo(() => {
    return alert.create({
      type: AlertType.LOADING,
      description: t('Home_deletingDocuments', { ns: Namespaces.APP }),
    })
  }, [alert, t])


  const showErrorDeletingSelectedDocumentsAlert = useCallback(() => {
    alert.show({
      icon: 'alert-outline',
      title: t(
        'ErrorDeletingSelectedDocumentsModal_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'ErrorDeletingSelectedDocumentsModal_description',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const tryDeleteSelectedDocuments = useCallback(async () => {
    if (isLoading) return

    const selectedDocumentIds = getSelectedDocumentIds()
    if (!selectedDocumentIds.length) return

    try {
      setIsLoading(true)
      alert.show(deletingSelectedDocumentsAlert)

      // TODO: Add another try/catch to delete all other documents and show
      // alert for the failed ones
      for (let i = 0; i < selectedDocumentIds.length; i++) {
        const documentId = selectedDocumentIds[i]

        await documentService.transaction(async tx => {
          // TODO: May be needed to paginate this and add the pictures
          // for deletion in a NativeModule in batch
          // const fileNames = await pictureService.findFileNamesByDocumentId(
          //   documentId,
          //   tx,
          // )

          await pictureService.deleteByDocumentId(documentId, tx)
          await documentService.deleteById(documentId, tx)
        })

        // TODO: Add `fileNames` to delete through a NativeModule
      }

      setIsLoading(false)
      alert.dismiss(deletingSelectedDocumentsAlert.id)

      exitSelection()
      onSuccess?.()
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = errorInstance.message
      const errorStack = getErrorStackTrace(errorInstance)

      showErrorDeletingSelectedDocumentsAlert()
      setIsLoading(false)
      alert.dismiss(deletingSelectedDocumentsAlert.id)

      await logger.error(
        `Error deleting selected documents: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    isLoading,
    getSelectedDocumentIds,
    alert,
    deletingSelectedDocumentsAlert,
    documentService,
    pictureService,
    exitSelection,
    onSuccess,
    showErrorDeletingSelectedDocumentsAlert,
    logger,
  ])


  const showConfirmDeleteSelectedDocumentsAlert = useCallback(() => {
    alert.show({
      icon: 'trash-can-outline',
      title: t(
        'DeleteSelectedDocumentsModal_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'DeleteSelectedDocumentsModal_description',
        { ns: Namespaces.APP },
      ),
      buttons: [
        {
          label: t('cancel'),
          onPress: ({ dismiss }) => {
            dismiss()
          },
        },
        {
          label: t('delete'),
          onPress: ({ dismiss }) => {
            dismiss()
            tryDeleteSelectedDocuments()
          },
        },
      ],
    })
  }, [alert, t, tryDeleteSelectedDocuments])


  const deleteSelectedDocuments = useMemo<DeleteSelectedDocuments>(() => ({
    isLoading,
    deleteSelectedDocuments: showConfirmDeleteSelectedDocumentsAlert,
  }), [isLoading, showConfirmDeleteSelectedDocumentsAlert])


  return deleteSelectedDocuments
}

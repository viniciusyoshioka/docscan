import { useCallback, useMemo, useState } from 'react'

import { useServices } from '@database'
import { Namespaces, useLocale } from '@locale'
import { AlertType, useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError } from '@utils'
import { useGoBack } from './useGoBack.ts'


interface DeleteCurrentDocument {
  isLoading: boolean
  deleteCurrentDocument: () => void
}


export function useDeleteCurrentDocument(): DeleteCurrentDocument {


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()
  const { documentService, pictureService } = useServices()
  const { document } = useDocumentState()

  const [isLoading, setIsLoading] = useState(false)

  const goBack = useGoBack()


  const deletingCurrentDocumentAlert = useMemo(() => {
    return alert.create({
      type: AlertType.LOADING,
      description: t(
        'DocumentDetail_alert_deletingCurrentDocument_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const showErrorDeletingCurrentDocumentAlert = useCallback(() => {
    alert.show({
      icon: 'alert-outline',
      title: t(
        'DocumentDetail_alert_errorDeletingCurrentDocument_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'DocumentDetail_alert_errorDeletingCurrentDocument_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const tryDeleteCurrentDocument = useCallback(async () => {
    if (!document?.id) return
    if (isLoading) return

    try {
      setIsLoading(true)
      alert.show(deletingCurrentDocumentAlert)

      await documentService.transaction(async tx => {
        if (!document.id) return

        // TODO: May be needed to paginate this and add the pictures
        // for deletion in a NativeModule in batch
        // const fileNames = await pictureService.findFileNamesByDocumentId(
        //   document.id,
        //   tx,
        // )

        await pictureService.deleteByDocumentId(document.id, tx)
        await documentService.deleteById(document.id, tx)

        // TODO: Commit deletion of `fileNames` through a NativeModule
      })

      setIsLoading(false)
      alert.dismiss(deletingCurrentDocumentAlert.id)

      goBack()
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = errorInstance.message
      const errorStack = getErrorStackTrace(errorInstance)

      showErrorDeletingCurrentDocumentAlert()
      setIsLoading(false)
      alert.dismiss(deletingCurrentDocumentAlert.id)

      await logger.error(
        `Error deleting current document: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    document,
    isLoading,
    alert,
    deletingCurrentDocumentAlert,
    documentService,
    pictureService,
    goBack,
    showErrorDeletingCurrentDocumentAlert,
    logger,
  ])


  const showConfirmDeleteCurrentDocumentAlert = useCallback(() => {
    alert.show({
      icon: 'trash-can-outline',
      title: t(
        'DocumentDetail_alert_confirmDeleteCurrentDocument_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'DocumentDetail_alert_confirmDeleteCurrentDocument_text',
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
            tryDeleteCurrentDocument()
          },
        },
      ],
    })
  }, [alert, t, tryDeleteCurrentDocument])


  const deleteCurrentDocument = useMemo<DeleteCurrentDocument>(() => ({
    isLoading,
    deleteCurrentDocument: showConfirmDeleteCurrentDocumentAlert,
  }), [isLoading, showConfirmDeleteCurrentDocumentAlert])


  return deleteCurrentDocument
}

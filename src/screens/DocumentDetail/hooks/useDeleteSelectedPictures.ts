import { useCallback, useMemo, useState } from 'react'

import type { PictureId } from '@database'
import { useServices } from '@database'
import { Namespaces, useLocale } from '@locale'
import { AlertType, useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { useLogger } from '@modules/logger'
import { createBatchArray, getErrorStackTrace, normalizeError } from '@utils'


const PICTURES_BATCH_SIZE = 30


interface DeleteSelectedPicturesParams {
  getSelectedPictureIds: () => PictureId[]
  exitSelection: () => void
}


interface DeleteSelectedPictures {
  isLoading: boolean
  deleteSelectedPictures: () => void
}


export function useDeleteSelectedPictures(
  params: DeleteSelectedPicturesParams,
): DeleteSelectedPictures {
  const { getSelectedPictureIds, exitSelection } = params


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()
  const { documentService, pictureService } = useServices()
  const { document, removePictures } = useDocumentState()

  const [isLoading, setIsLoading] = useState(false)


  const deletingSelectedPicturesAlert = useMemo(() => {
    return alert.create({
      type: AlertType.LOADING,
      description: t(
        'DocumentDetail_alert_deletingSelectedPictures_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const showErrorDeletingSelectedPicturesAlert = useCallback(() => {
    alert.show({
      icon: 'alert-outline',
      title: t('warn'),
      description: t(
        'DocumentDetail_alert_errorDeletingSelectedPictures_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const tryDeleteSelectedPictures = useCallback(async () => {
    const documentId = document?.id

    if (!documentId) return
    if (isLoading) return

    const selectedPictureIds = getSelectedPictureIds()
    if (!selectedPictureIds.length) return

    try {
      setIsLoading(true)
      alert.show(deletingSelectedPicturesAlert)

      const data = await pictureService.transaction(async tx => {
        const picturesBatch = createBatchArray(
          selectedPictureIds,
          PICTURES_BATCH_SIZE,
        )

        for (let i = 0; i < picturesBatch.length; i++) {
          const batch = picturesBatch[i]

          // TODO: Add `fileNames` to delete through a NativeModule
          // const fileNames = await pictureService.findFileNamesByPictureIds(
          //   batch,
          //   tx,
          // )

          await pictureService.deleteByIds(batch, tx)
        }

        const updatedDocument = await documentService.updateUpdatedAt(
          documentId,
          tx,
        )

        return { updatedDocument }
      })

      // TODO: Commit to the NativeModule the files deletion

      setIsLoading(false)
      alert.dismiss(deletingSelectedPicturesAlert.id)

      removePictures(selectedPictureIds, data.updatedDocument)
      exitSelection()
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = errorInstance.message
      const errorStack = getErrorStackTrace(errorInstance)

      showErrorDeletingSelectedPicturesAlert()
      setIsLoading(false)
      alert.dismiss(deletingSelectedPicturesAlert.id)

      await logger.error(
        `Error deleting selected pictures: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    document,
    isLoading,
    getSelectedPictureIds,
    alert,
    deletingSelectedPicturesAlert,
    pictureService,
    documentService,
    removePictures,
    exitSelection,
    showErrorDeletingSelectedPicturesAlert,
    logger,
  ])


  const showConfirmDeleteSelectedPicturesAlert = useCallback(() => {
    alert.show({
      icon: 'trash-can-outline',
      title: t(
        'DocumentDetail_alert_confirmDeleteSelectedPictures_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'DocumentDetail_alert_confirmDeleteSelectedPictures_text',
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
            tryDeleteSelectedPictures()
          },
        },
      ],
    })
  }, [alert, t, tryDeleteSelectedPictures])


  const deleteSelectedPictures = useMemo<DeleteSelectedPictures>(() => ({
    isLoading,
    deleteSelectedPictures: showConfirmDeleteSelectedPicturesAlert,
  }), [isLoading, showConfirmDeleteSelectedPicturesAlert])


  return deleteSelectedPictures
}

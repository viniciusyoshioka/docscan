import { useCallback, useMemo, useState } from 'react'

import { Namespaces, useLocale } from '@locale'
import { AlertType, useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { AbsolutePath, useFileSystem } from '@modules/file-system'
import { Info } from '@modules/info'
import { useLogger } from '@modules/logger'
import type { UsePermissionStatus } from '@modules/permission'
import { Permissions, PermissionUtils, usePermission } from '@modules/permission'
import { getErrorStackTrace, normalizeError } from '@utils'


interface DeleteDocumentPdfFile {
  isLoading: boolean
  deleteDocumentPdfFile: () => void
}


export function useDeleteDocumentPdfFile(): DeleteDocumentPdfFile {


  const alert = useAlert()
  const { t } = useLocale()
  const fileSystem = useFileSystem()
  const logger = useLogger()
  const permission = usePermission(Permissions.WRITE_STORAGE)
  const { document } = useDocumentState()

  const [isLoading, setIsLoading] = useState(false)

  const deletingDocumentPdfFileAlert = useMemo(() => {
    return alert.create({
      type: AlertType.LOADING,
      description: t(
        'DocumentDetail_alert_deletingDocumentPdfFile_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const showNoPermissionToDeleteDocumentPdfFileAlert = useCallback(
    (permissionStatus: UsePermissionStatus) => {
      const canRequest = PermissionUtils.canRequestDenied(permissionStatus)

      const requestPermissionLabel = canRequest
        ? t('requestPermission')
        : t('openSettings')

      const requestPermissionFunction = canRequest
        ? permission.request
        : permission.openSettings

      alert.show({
        icon: 'alert-outline',
        title: t('permissionDenied'),
        description: t(
          'DocumentDetail_alert_noPermissionToDeleteDocumentPdf_text',
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
            label: requestPermissionLabel,
            onPress: ({ dismiss }) => {
              requestPermissionFunction()
              dismiss()
            },
          },
        ],
      })
    },
    [alert, t, permission],
  )


  const hasWriteStoragePermission = useCallback(async (): Promise<boolean> => {
    const isGranted = PermissionUtils.isGranted(permission.status)
    if (isGranted) {
      return true
    }

    const [
      permissionStatus,
      permissionError,
    ] = await permission.checkAndRequestIfDenied()

    if (permissionError) {
      const errorMessage = permissionError.message
      const errorStack = permissionError.stack

      logger.error(
        `Unexpected error checking and requesting permission "${Permissions.WRITE_STORAGE}" before deleting document's pdf file: "${errorMessage}"`,
        errorStack,
      )

      throw permissionError
    }

    if (PermissionUtils.isDenied(permissionStatus)) {
      showNoPermissionToDeleteDocumentPdfFileAlert(permissionStatus)

      logger.warn(
        `Permission "${Permissions.WRITE_STORAGE}", to delete document's pdf file, was denied`,
      )

      return false
    }

    return true
  }, [permission, logger, showNoPermissionToDeleteDocumentPdfFileAlert])


  const showDocumentPdfFileDeletedSuccessfullyAlert = useCallback(() => {
    alert.show({
      icon: 'check',
      title: t('success'),
      description: t(
        'DocumentDetail_alert_documentPdfFileDeletedSuccessfully_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const showErrorDeletingDocumentPdfFileAlert = useCallback(() => {
    alert.show({
      icon: 'alert-outline',
      title: t('warn'),
      description: t(
        'DocumentDetail_alert_errorDeletingDocumentPdfFile_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const tryDeleteDocumentPdfFile = useCallback(async () => {
    if (!document?.id) return
    if (isLoading) return

    try {
      setIsLoading(true)
      alert.show(deletingDocumentPdfFileAlert)

      const hasPermission = await hasWriteStoragePermission()
      if (!hasPermission) {
        setIsLoading(false)
        alert.dismiss(deletingDocumentPdfFileAlert.id)
        return
      }

      const documentPdfPath = new AbsolutePath([
        Info.folders.external.exportedPdfs,
        document.title,
      ])

      const fileExists = await fileSystem.exists(documentPdfPath)
      if (fileExists) {
        await fileSystem.deleteFile(documentPdfPath)
      }

      setIsLoading(false)
      alert.dismiss(deletingDocumentPdfFileAlert.id)
      showDocumentPdfFileDeletedSuccessfullyAlert()
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = errorInstance.message
      const errorStack = getErrorStackTrace(errorInstance)

      showErrorDeletingDocumentPdfFileAlert()
      setIsLoading(false)
      alert.dismiss(deletingDocumentPdfFileAlert.id)

      await logger.error(
        `Error deleting document's pdf file: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    document,
    isLoading,
    alert,
    deletingDocumentPdfFileAlert,
    hasWriteStoragePermission,
    fileSystem,
    showDocumentPdfFileDeletedSuccessfullyAlert,
    showErrorDeletingDocumentPdfFileAlert,
    logger,
  ])


  const showConfirmDeleteDocumentPdfFileAlert = useCallback(() => {
    alert.show({
      icon: 'file-document-remove-outline',
      title: t(
        'DocumentDetail_alert_confirmDeleteDocumentPdfFile_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'DocumentDetail_alert_confirmDeleteDocumentPdfFile_text',
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
            tryDeleteDocumentPdfFile()
          },
        },
      ],
    })
  }, [alert, t, tryDeleteDocumentPdfFile])


  const deleteDocumentPdfFile = useMemo<DeleteDocumentPdfFile>(() => ({
    isLoading,
    deleteDocumentPdfFile: showConfirmDeleteDocumentPdfFileAlert,
  }), [isLoading, showConfirmDeleteDocumentPdfFileAlert])


  return deleteDocumentPdfFile
}

import { useCallback } from 'react'
import Share from 'react-native-share'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { AbsolutePath, PathUtils, useFileSystem } from '@modules/file-system'
import { Info } from '@modules/info'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'
import { useOpenConvertDocumentToPdfModal } from './useOpenConvertDocumentToPdfModal.ts'


type ShareDocumentAsPdf = () => Promise<void>


export function useShareDocumentAsPdf(): ShareDocumentAsPdf {


  const { t } = useLocale()
  const alert = useAlert()
  const logger = useLogger()
  const fileSystem = useFileSystem()
  const { document } = useDocumentState()

  const openConvertDocumentToPdfModal = useOpenConvertDocumentToPdfModal()


  const showDocumentPdfFileDoesNotExistsAlert = useCallback(() => {
    alert.show({
      icon: 'magnify-remove-outline',
      title: t('warn'),
      description: t(
        'DocumentDetail_alert_pdfFileNotFoundToShare_text',
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
          label: t('convert'),
          onPress: ({ dismiss }) => {
            dismiss()
            openConvertDocumentToPdfModal()
          },
        },
      ],
    })
  }, [alert, t, openConvertDocumentToPdfModal])


  const shareDocumentAsPdf = useCallback(async () => {
    if (!document?.id) return

    try {
      // TODO: After implementing the pdf conversor, check witch path stores
      // the exported file and witch path shares it. Prefer to export the pdf
      // with the document's title as file name instead of its id

      const documentExportedPdfPath = new AbsolutePath([
        Info.folders.internal.temporaryExportedPdfs,
        `${document.id}.pdf`,
      ])

      const fileExists = await fileSystem.exists(documentExportedPdfPath)
      if (!fileExists) {
        showDocumentPdfFileDoesNotExistsAlert()
        return
      }

      const appDatabasePathWithFileProtocol = PathUtils.withFileProtocol(
        documentExportedPdfPath,
      )

      await Share.open({
        type: 'application/pdf',
        url: appDatabasePathWithFileProtocol,
        failOnCancel: false,
      })
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      alert.show({
        title: t('warn'),
        description: t(
          'DocumentDetail_alert_errorSharingPdf_text',
          { ns: Namespaces.APP },
        ),
      })

      await logger.error(
        `Error sharing document PDF file: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    document,
    fileSystem,
    showDocumentPdfFileDoesNotExistsAlert,
    alert,
    t,
    logger,
  ])


  return shareDocumentAsPdf
}

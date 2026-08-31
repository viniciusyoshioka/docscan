import { useCallback } from 'react'
import { open } from 'react-native-file-viewer-turbo'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { AbsolutePath, useFileSystem } from '@modules/file-system'
import { Info } from '@modules/info'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'
import { useOpenConvertDocumentToPdfModal } from './useOpenConvertDocumentToPdfModal.ts'


type VisualizeDocumentPdfFile = () => Promise<void>


export function useVisualizeDocumentPdfFile(): VisualizeDocumentPdfFile {


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
        'DocumentDetail_alert_pdfFileNotFoundToVisualize_text',
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


  const visualizeDocumentPdfFile = useCallback(async () => {
    if (!document?.id) return

    try {
      // TODO: After implementing the pdf conversor, check witch path stores
      // the exported file and witch path visualizes it. Prefer to export the
      // pdf with the document's title as file name instead of its id

      const documentExportedPdfPath = new AbsolutePath([
        Info.folders.internal.temporaryExportedPdfs,
        `${document.id}.pdf`,
      ])

      const fileExists = await fileSystem.exists(documentExportedPdfPath)
      if (!fileExists) {
        showDocumentPdfFileDoesNotExistsAlert()
        return
      }

      await open(documentExportedPdfPath.absolutePath)
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      alert.show({
        title: t('warn'),
        description: t(
          'DocumentDetail_alert_errorVisualizingPdfFile_text',
          { ns: Namespaces.APP },
        ),
      })

      await logger.error(
        `Error visualizing document PDF file: "${errorMessage}"`,
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


  return visualizeDocumentPdfFile
}

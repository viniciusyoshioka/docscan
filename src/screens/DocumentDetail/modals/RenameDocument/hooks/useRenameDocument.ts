import type { RefObject } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { TextInput } from 'react-native'
import { Keyboard } from 'react-native'

import { useServices } from '@database'
import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'
import { useGoBack } from './useGoBack.ts'


interface RenameDocumentParams {
  hasChangedTitle: boolean
  newTitle: string
  inputRef: RefObject<TextInput | null>
}


interface RenameDocument {
  isLoading: boolean
  error: Error | null
  renameDocument: () => Promise<void>
}


export function useRenameDocument(
  params: RenameDocumentParams,
): RenameDocument {
  const { hasChangedTitle, newTitle, inputRef } = params


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()

  const { documentService } = useServices()
  const { document, setDocument } = useDocumentState()

  const goBack = useGoBack()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)


  const showNewTitleCannotBeEmptyAlert = useCallback(() => {
    alert.show({
      icon: 'alert-outline',
      title: t('warn'),
      description: t(
        'RenameDocument_alert_newDocumentTitleCannotBeEmpty_text',
        { ns: Namespaces.APP },
      ),
      buttons: [
        {
          label: t('ok'),
          onPress: ({ dismiss }) => {
            dismiss()
            inputRef.current?.focus()
          },
        },
      ],
    })
  }, [alert, t, inputRef])


  const showErrorRenamingDocumentAlert = useCallback(() => {
    alert.show({
      icon: 'alert-outline',
      title: t(
        'RenameDocument_alert_errorRenamingDocument_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'RenameDocument_alert_errorRenamingDocument_description',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  const renameDocument = useCallback(async () => {
    if (isLoading) return

    const documentId = document?.id
    if (!documentId) {
      logger.warn(
        'Called "renameDocument" without a documentId. Either the document does not exists or its a bug',
      )
      return
    }

    try {
      Keyboard.dismiss()

      if (!hasChangedTitle) {
        goBack()
        return
      }

      if (!newTitle.trim().length) {
        showNewTitleCannotBeEmptyAlert()
        return
      }

      setIsLoading(true)
      setError(null)

      const updatedDocument = await documentService.update(
        documentId,
        {
          title: newTitle.trim(),
        },
      )

      setDocument(updatedDocument)
      setIsLoading(false)
      goBack()
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      setIsLoading(false)
      setError(errorInstance)

      showErrorRenamingDocumentAlert()

      await logger.error(
        `Error renaming document (id: ${documentId}): ${errorMessage}`,
        errorStack,
      )
    }
  }, [
    isLoading,
    document,
    logger,
    hasChangedTitle,
    documentService,
    newTitle,
    setDocument,
    goBack,
    showNewTitleCannotBeEmptyAlert,
    showErrorRenamingDocumentAlert,
  ])


  const renameDocumentResult = useMemo<RenameDocument>(() => ({
    isLoading,
    error,
    renameDocument,
  }), [
    isLoading,
    error,
    renameDocument,
  ])


  return renameDocumentResult
}

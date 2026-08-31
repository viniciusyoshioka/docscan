import type { RefObject } from 'react'
import { useCallback } from 'react'
import type { TextInput } from 'react-native'

import { useGoBack } from './useGoBack.ts'
import { useShowConfirmDiscardNewDocumentTitleAlert } from './useShowConfirmDiscardNewDocumentTitleAlert.ts'


interface OnDismissRenameDocumentParams {
  inputRef: RefObject<TextInput | null>
  isDisabled?: boolean
  hasChangedTitle: boolean
}


type OnDismissRenameDocument = () => Promise<boolean>


export function useOnDismissRenameDocument(
  params: OnDismissRenameDocumentParams,
): OnDismissRenameDocument {
  const {
    inputRef,
    isDisabled = false,
    hasChangedTitle,
  } = params


  const goBack = useGoBack({ isDisabled })

  const showConfirmDiscardNewDocumentTitleAlert =
    useShowConfirmDiscardNewDocumentTitleAlert()


  const onDismissRenameDocument = useCallback(async () => {
    const isInputFocused = inputRef.current?.isFocused()
    if (isInputFocused) {
      inputRef.current?.blur()
      return true
    }

    if (isDisabled) {
      return true
    }

    if (hasChangedTitle) {
      const discardNewTitle = await showConfirmDiscardNewDocumentTitleAlert()
      if (!discardNewTitle) {
        return true
      }
    }

    goBack()
    return true
  }, [
    inputRef,
    isDisabled,
    hasChangedTitle,
    showConfirmDiscardNewDocumentTitleAlert,
    goBack,
  ])


  return onDismissRenameDocument
}

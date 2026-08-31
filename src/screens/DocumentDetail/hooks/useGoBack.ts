import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { useDocumentState } from '@modules/document-state'
import type { NavigationProps } from '@routes'


interface GoBackParams {
  isSelectionMode?: boolean
  exitSelection?: () => void
}


type GoBack = () => boolean


export function useGoBack(params?: GoBackParams): GoBack {
  const { isSelectionMode, exitSelection } = params ?? {}


  const navigation = useNavigation<NavigationProps<'DocumentDetail'>>()

  const { closeDocument } = useDocumentState()


  const goBack = useCallback(() => {
    if (isSelectionMode) {
      exitSelection?.()
      return true
    }

    closeDocument()
    navigation.goBack()
    return true
  }, [
    isSelectionMode,
    exitSelection,
    closeDocument,
    navigation,
  ])


  return goBack
}

import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


interface GoBackParams {
  hasBlockingModal: boolean
  isSelectionMode: boolean
  exitSelection: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const navigation = useNavigation<NavigationProps<'Gallery'>>()


  const goBack = useCallback<GoBack>((): boolean => {
    if (params.hasBlockingModal) {
      return true
    }

    if (params.isSelectionMode) {
      params.exitSelection()
      return true
    }

    navigation.goBack()
    return true
  }, [
    params.hasBlockingModal,
    params.isSelectionMode,
    params.exitSelection,
    navigation.goBack,
  ])


  return goBack
}

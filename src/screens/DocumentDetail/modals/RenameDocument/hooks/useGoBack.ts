import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


interface GoBackParams {
  isDisabled?: boolean
}


type GoBack = () => boolean


export function useGoBack(params?: GoBackParams): GoBack {
  const { isDisabled = false } = params ?? {}


  const navigation = useNavigation<NavigationProps<'RenameDocument'>>()


  const goBack = useCallback(() => {
    if (isDisabled) {
      return true
    }

    navigation.goBack()
    return true
  }, [isDisabled, navigation])


  return goBack
}

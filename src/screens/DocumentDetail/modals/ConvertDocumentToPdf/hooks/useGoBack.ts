import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type GoBack = () => boolean


export function useGoBack(): GoBack {


  const navigation = useNavigation<NavigationProps<'ConvertDocumentToPdf'>>()


  const goBack = useCallback(() => {
    navigation.goBack()
    return true
  }, [navigation])


  return goBack
}

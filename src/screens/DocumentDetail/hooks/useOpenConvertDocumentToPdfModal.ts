import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type OpenConvertDocumentToPdfModal = () => void


export function useOpenConvertDocumentToPdfModal():
OpenConvertDocumentToPdfModal {


  const navigation = useNavigation<NavigationProps<'DocumentDetail'>>()


  const openConvertDocumentToPdfModal = useCallback(() => {
    navigation.navigate('ConvertDocumentToPdf')
  }, [navigation])


  return openConvertDocumentToPdfModal
}

import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type GoToDocumentDetail = () => void


export function useGoToDocumentDetail(): GoToDocumentDetail {


  const navigation = useNavigation<NavigationProps<'Home'>>()


  const goToDocumentDetail = useCallback<GoToDocumentDetail>(() => {
    navigation.navigate('DocumentDetail')
  }, [navigation])


  return goToDocumentDetail
}

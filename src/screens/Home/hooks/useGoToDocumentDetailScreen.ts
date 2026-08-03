import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type GoToDocumentDetailScreen = () => void


export function useGoToDocumentDetailScreen(): GoToDocumentDetailScreen {


  const navigation = useNavigation<NavigationProps<'Home'>>()


  const goToDocumentDetailScreen = useCallback<GoToDocumentDetailScreen>(() => {
    navigation.navigate('DocumentDetail')
  }, [navigation])


  return goToDocumentDetailScreen
}

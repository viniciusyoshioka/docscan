import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type GoBack = () => boolean


export function useGoBack(): GoBack {


  const navigation = useNavigation<NavigationProps<'Settings'>>()


  const goBack = useCallback((): boolean => {
    navigation.navigate('Home')
    return true
  }, [navigation])


  return goBack
}

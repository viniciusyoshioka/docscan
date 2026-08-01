import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type GoToCameraScreen = () => void


export function useGoToCameraScreen(): GoToCameraScreen {


  const navigation = useNavigation<NavigationProps<'Home'>>()


  const goToCameraScreen = useCallback<GoToCameraScreen>(() => {
    navigation.navigate('Camera')
  }, [navigation])


  return goToCameraScreen
}

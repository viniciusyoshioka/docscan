import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type GoToSettingsScreen = () => void


export function useGoToSettingsScreen(): GoToSettingsScreen {


  const navigation = useNavigation<NavigationProps<'Home'>>()


  const goToSettingsScreen = useCallback<GoToSettingsScreen>(() => {
    navigation.navigate('Settings')
  }, [navigation])


  return goToSettingsScreen
}

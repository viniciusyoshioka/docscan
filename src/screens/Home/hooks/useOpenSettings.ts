import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type OpenSettings = () => void


export function useOpenSettings(): OpenSettings {


  const navigation = useNavigation<NavigationProps<'Home'>>()


  const openSettings = useCallback(() => {
    navigation.navigate('Settings')
  }, [navigation])


  return openSettings
}

import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import type { NavigationProps } from '@routes'


type OpenChangeThemeModal = () => void


export function useOpenChangeThemeModal(): OpenChangeThemeModal {


  const navigation = useNavigation<NavigationProps<'Settings'>>()


  const openChangeThemeModal = useCallback(() => {
    navigation.navigate('ChangeTheme')
  }, [navigation])


  return openChangeThemeModal
}

import { useNavigation } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'

import type { Theme } from '@modules/settings'
import { useSettings } from '@modules/settings'
import type { NavigationProps } from '@routes'


export function useChangeTheme() {


  const navigation = useNavigation<NavigationProps<'ChangeTheme'>>()

  const { settings, setSettings } = useSettings()

  const [selectedTheme, setSelectedTheme] = useState(settings.theme)


  const selectTheme = useCallback((newSelectedTheme: string) => {
    setSelectedTheme(newSelectedTheme as Theme)
  }, [])

  const cancel = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const updateTheme = useCallback(() => {
    setSettings({ theme: selectedTheme })
    navigation.goBack()
  }, [selectedTheme, navigation])


  const changeTheme = useMemo(() => ({
    selectedTheme,
    selectTheme,
    cancel,
    updateTheme,
  }), [
    selectedTheme,
    selectTheme,
    cancel,
    updateTheme,
  ])


  return changeTheme
}

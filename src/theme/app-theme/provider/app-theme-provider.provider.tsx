import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { MaterialProvider } from 'react-material-design-provider'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'

import { Theme } from '@modules/settings'
import type { AppTheme } from '../app-theme.types.ts'
import { AppThemeLight } from '../themes'
import type { ThemeObject } from './app-theme-provider.types.ts'
import { ThemeName, THEMES } from './app-theme-provider.types.ts'


const AppThemeContext = createContext(AppThemeLight)


interface AppThemeProviderProps extends PropsWithChildren {
  theme: Theme
}


export function AppThemeProvider(props: AppThemeProviderProps) {


  const deviceTheme = useColorScheme()


  const currentThemeName = useMemo<ThemeName>(() => {
    const isSettingsThemeDark = props.theme === Theme.DARK
    const isSettingsThemeAuto = props.theme === Theme.AUTO
    const isDeviceThemeDark = deviceTheme === 'dark'

    const isAppThemeDark = isSettingsThemeDark
      || (isSettingsThemeAuto && isDeviceThemeDark)

    return isAppThemeDark ? ThemeName.DARK : ThemeName.LIGHT
  }, [props.theme, deviceTheme])


  const currentThemeObject = useMemo<ThemeObject>(() => (
    THEMES[currentThemeName]
  ), [currentThemeName])


  return (
    <AppThemeContext.Provider value={currentThemeObject.appTheme}>
      <MaterialProvider theme={currentThemeObject.materialTheme}>
        <PaperProvider theme={currentThemeObject.paperTheme}>
          {props.children}
        </PaperProvider>
      </MaterialProvider>
    </AppThemeContext.Provider>
  )
}


export function useAppTheme(): AppTheme {
  return useContext(AppThemeContext)
}

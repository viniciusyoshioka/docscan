import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from "react"
import {
  MaterialDarkTheme,
  MaterialLightTheme,
  MaterialProvider,
  MaterialTheme,
} from "react-material-design-provider"
import { useColorScheme } from "react-native"
import { MD3DarkTheme, MD3LightTheme, MD3Theme, PaperProvider } from "react-native-paper"
import { UnistylesRuntime } from "react-native-unistyles"

import { Theme, useSettings } from "@libs/settings"
import { AppThemeDark } from "./app-theme.dark"
import { AppThemeLight } from "./app-theme.light"
import { AppTheme } from "./app-theme.types"


enum ThemeName {
  LIGHT = "light",
  DARK = "dark",
}

type ThemeObject = {
  appTheme: AppTheme
  materialTheme: MaterialTheme
  paperTheme: MD3Theme
}

type Themes = {
  [key in ThemeName]: ThemeObject
}

const themes: Themes = {
  light: {
    appTheme: AppThemeLight,
    materialTheme: MaterialLightTheme,
    paperTheme: MD3LightTheme,
  },
  dark: {
    appTheme: AppThemeDark,
    materialTheme: MaterialDarkTheme,
    paperTheme: MD3DarkTheme,
  },
}


const AppThemeContext = createContext<AppTheme>(AppThemeLight)


export function AppThemeProvider(props: PropsWithChildren) {


  const deviceTheme = useColorScheme()

  const { settings } = useSettings()


  const currentThemeName = useMemo<ThemeName>(() => {
    const isDeviceThemeDark = settings.theme === Theme.AUTO && deviceTheme === "dark"
    const isAppThemeDark = settings.theme === Theme.DARK
    return (isDeviceThemeDark || isAppThemeDark) ? ThemeName.DARK : ThemeName.LIGHT
  }, [settings.theme, deviceTheme])

  const currentThemeObject = useMemo<ThemeObject>(() => (
    themes[currentThemeName]
  ), [currentThemeName])


  useEffect(() => {
    if (currentThemeName === ThemeName.DARK) {
      UnistylesRuntime.setTheme("dark")
    } else {
      UnistylesRuntime.setTheme("light")
    }
  }, [currentThemeName])


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

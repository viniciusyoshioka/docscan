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

import { useSettings } from "@libs/settings"
import { AppThemeDark } from "./theme-dark"
import { AppThemeLight } from "./theme-light"
import { AppTheme } from "./types"


type ThemeName = "light" | "dark"

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


const AppThemeContext = createContext(AppThemeLight)


export function AppThemeProvider(props: PropsWithChildren) {


  const deviceTheme = useColorScheme()

  const { settings } = useSettings()


  const currentTheme = useMemo<ThemeName>(() => {
    const isDeviceThemeDark = (settings.theme === "auto" && deviceTheme === "dark")
    const isAppThemeDark = settings.theme === "dark"
    return (isDeviceThemeDark || isAppThemeDark) ? "dark" : "light"
  }, [settings.theme, deviceTheme])

  const { appTheme, materialTheme, paperTheme } = useMemo<ThemeObject>(() => (
    themes[currentTheme]
  ), [currentTheme])


  useEffect(() => {
    if (currentTheme === "dark") {
      UnistylesRuntime.setTheme("dark")
    } else {
      UnistylesRuntime.setTheme("light")
    }
  }, [currentTheme])


  return (
    <AppThemeContext.Provider value={appTheme}>
      <MaterialProvider theme={materialTheme}>
        <PaperProvider theme={paperTheme}>
          {props.children}
        </PaperProvider>
      </MaterialProvider>
    </AppThemeContext.Provider>
  )
}


export function useAppTheme() {
  return useContext(AppThemeContext)
}

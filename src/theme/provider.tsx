import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from "react"
import {
  MaterialDarkTheme,
  MaterialLightTheme,
  MaterialProvider,
} from "react-material-design-provider"
import { useColorScheme } from "react-native"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { UnistylesRuntime } from "react-native-unistyles"

import { useSettings } from "@lib/settings"
import { AppThemeDark } from "./theme-dark"
import { AppThemeLight } from "./theme-light"


const AppThemeContext = createContext(AppThemeLight)


export function AppThemeProvider(props: PropsWithChildren) {


  const deviceTheme = useColorScheme()

  const { settings } = useSettings()


  const isDarkTheme = useMemo(() => (
    (settings.theme === "auto" && deviceTheme === "dark") || settings.theme === "dark"
  ), [settings.theme, deviceTheme])

  const { appTheme, materialTheme, paperTheme } = useMemo(() => ({
    appTheme: isDarkTheme ? AppThemeDark : AppThemeLight,
    materialTheme: isDarkTheme ? MaterialDarkTheme : MaterialLightTheme,
    paperTheme: isDarkTheme ? MD3DarkTheme : MD3LightTheme,
  }), [isDarkTheme])


  useEffect(() => {
    if (isDarkTheme) {
      UnistylesRuntime.setTheme("dark")
    } else {
      UnistylesRuntime.setTheme("light")
    }
  }, [isDarkTheme])


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

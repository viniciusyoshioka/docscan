import { ThemeProvider as ElementiumThemeProvider } from "@elementium/native"
import { createContext, ReactNode, useContext, useEffect } from "react"
import { StatusBar, StatusBarStyle, useColorScheme } from "react-native"
import { ThemeProvider as StyledThemeProvider } from "styled-components/native"

import { Settings } from "../services/settings"
import { AppStorageKeys, useMMKVObject } from "../services/storage"
import { themeDefault } from "./constants"
import { AppLightTheme } from "./light"
import { AppThemeType, ThemeType } from "./types"


const AppThemeContext = createContext<AppThemeType>(AppLightTheme)


export interface AppThemeProviderProps {
    children?: ReactNode;
}


export function AppThemeProvider(props: AppThemeProviderProps) {


    const deviceTheme = useColorScheme()

    const [settings, setSettings] = useMMKVObject<Settings>(AppStorageKeys.SETTINGS)
    const isDarkTheme = (settings?.theme === "auto" && deviceTheme === "dark") || settings?.theme === "dark"


    function getAppTheme(): AppThemeType {
        const switchTheme = (newTheme: ThemeType) => {
            if (settings) setSettings({ ...settings, theme: newTheme })
        }

        if (isDarkTheme) {
            const { AppDarkTheme } = require("./dark")
            AppDarkTheme.appTheme = settings?.theme
            AppDarkTheme.switchTheme = switchTheme
            return AppDarkTheme
        }

        const { AppLightTheme } = require("./light")
        AppLightTheme.appTheme = (settings?.theme ?? themeDefault) as ThemeType
        AppLightTheme.switchTheme = switchTheme
        return AppLightTheme
    }


    const appTheme = getAppTheme()


    useEffect(() => {
        const statusBarStyle: StatusBarStyle = appTheme.isDark ? "light-content" : "dark-content"
        StatusBar.setBarStyle(statusBarStyle)
        StatusBar.setBackgroundColor(appTheme.color.background)
    }, [appTheme.isDark, appTheme.color.background])


    return (
        <AppThemeContext.Provider value={appTheme}>
            <ElementiumThemeProvider value={appTheme}>
                <StyledThemeProvider theme={appTheme}>
                    {props.children}
                </StyledThemeProvider>
            </ElementiumThemeProvider>
        </AppThemeContext.Provider>
    )
}


export function useAppTheme() {
    return useContext(AppThemeContext)
}

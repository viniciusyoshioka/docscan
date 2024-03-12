import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import { MaterialDarkTheme, MaterialLightTheme, MaterialProvider } from "react-material-design-provider"
import { useColorScheme } from "react-native"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { UnistylesRuntime } from "react-native-unistyles"

import { Settings } from "@services/settings"
import { AppStorageKeys, useMMKVObject } from "@services/storage"
import { AppThemeDark } from "./theme-dark"
import { AppThemeLight } from "./theme-light"
import { AppTheme } from "./types"


const AppThemeContext = createContext<AppTheme>(AppThemeLight)


export function AppThemeProvider(props: PropsWithChildren) {


    const deviceTheme = useColorScheme()

    const [settings] = useMMKVObject<Settings>(AppStorageKeys.SETTINGS)
    const isDarkTheme = (settings?.theme === "auto" && deviceTheme === "dark")
        || settings?.theme === "dark"


    const appTheme = isDarkTheme ? AppThemeDark : AppThemeLight
    const materialTheme = isDarkTheme ? MaterialDarkTheme : MaterialLightTheme
    const paperTheme = isDarkTheme ? MD3DarkTheme : MD3LightTheme


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

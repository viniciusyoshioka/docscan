import { useEffect, useReducer } from "react"
import { useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { MenuProvider } from "react-native-popup-menu"

import { RealmProvider } from "./database"
import { useKeepAwakeOnDev } from "./hooks"
import { Router } from "./router"
import { DocumentDataProvider, reducerDocumentData } from "./services/document-data"
import { Settings, settingsDefault, SettingsProvider } from "./services/settings"
import { AppStorageKeys, setStorageDefaultValues, useMMKVObject } from "./services/storage"
import { AppThemeProvider, themeDefault, ThemeType } from "./theme"


// TODO change database library
export function App() {


    useKeepAwakeOnDev()


    const deviceTheme = useColorScheme()

    const [documentDataState, dispatchDocumentData] = useReducer(reducerDocumentData, undefined)
    const [settings, setSettings] = useMMKVObject<Settings>(AppStorageKeys.SETTINGS)

    const isDarkTheme = (settings?.theme === "auto" && deviceTheme === "dark") || settings?.theme === "dark"


    function getAppTheme() {
        const switchTheme = (newTheme: ThemeType) => {
            if (settings) setSettings({ ...settings, theme: newTheme })
        }

        if (isDarkTheme) {
            const { AppDarkTheme } = require("./theme")
            AppDarkTheme.appTheme = settings?.theme
            AppDarkTheme.switchTheme = switchTheme
            return AppDarkTheme
        }

        const { AppLightTheme } = require("./theme")
        AppLightTheme.appTheme = (settings?.theme ?? themeDefault) as ThemeType
        AppLightTheme.switchTheme = switchTheme
        return AppLightTheme
    }


    useEffect(() => {
        const wasDefaultValuesSet = setStorageDefaultValues()
        if (wasDefaultValuesSet) setSettings(settingsDefault)
    }, [])


    if (!settings) {
        return null
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppThemeProvider value={getAppTheme()}>
                <MenuProvider backHandler={true}>
                    <SettingsProvider value={{ settings, setSettings }}>
                        <DocumentDataProvider value={{ documentDataState, dispatchDocumentData }}>
                            <RealmProvider>
                                <Router />
                            </RealmProvider>
                        </DocumentDataProvider>
                    </SettingsProvider>
                </MenuProvider>
            </AppThemeProvider>
        </GestureHandlerRootView>
    )
}

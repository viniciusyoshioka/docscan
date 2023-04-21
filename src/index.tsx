import { useEffect, useReducer, useState } from "react"
import { useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { MenuProvider } from "react-native-popup-menu"
import SQLite from "react-native-sqlite-storage"

import { DocumentDatabase, LogDatabase, openAppDatabase, openLogDatabase, setGlobalAppDatabase, setGlobalLogDatabase } from "./database"
import { useKeepAwakeOnDev } from "./hooks"
import { Router } from "./router"
import { DocumentDataProvider, reducerDocumentData } from "./services/document"
import { logCriticalError, stringfyError } from "./services/log"
import { Settings, SettingsProvider } from "./services/settings"
import { AppStorageKeys, setStorageDefaultValues, useMMKVObject } from "./services/storage"
import { AppThemeProvider, themeDefault, ThemeType } from "./theme"


SQLite.enablePromise(true)


// TODO change database library
export function App() {


    useKeepAwakeOnDev()


    const deviceTheme = useColorScheme()

    const [appDb, setAppDb] = useState<SQLite.SQLiteDatabase>()
    const [logDb, setLogDb] = useState<SQLite.SQLiteDatabase>()
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
        setStorageDefaultValues()

        openAppDatabase()
            .then(async database => {
                function onTransactionError(error: SQLite.SQLError) {
                    logCriticalError(`Error creating tables in app database: "${stringfyError(error)}"`)
                }

                async function onTransactionSuccess() {
                    setAppDb(database)
                }

                setGlobalAppDatabase(database)

                database.transaction(tx => {
                    DocumentDatabase.createDocumentTable(tx)
                }, onTransactionError, onTransactionSuccess)
            })
            .catch(error => {
                logCriticalError(`Error opening app database: "${stringfyError(error)}"`)
            })

        openLogDatabase()
            .then(async database => {
                function onTransactionError(error: SQLite.SQLError) {
                    logCriticalError(`Error creating tables in log database: "${stringfyError(error)}"`)
                }

                function onTransactionSuccess() {
                    setLogDb(database)
                }

                setGlobalLogDatabase(database)

                database.transaction(tx => {
                    LogDatabase.createLogTable(tx)
                }, onTransactionError, onTransactionSuccess)
            })
            .catch(error => {
                logCriticalError(`Error opening log database: "${stringfyError(error)}"`)
            })
    }, [])


    if (!settings || !appDb || !logDb) {
        return null
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppThemeProvider value={getAppTheme()}>
                <MenuProvider backHandler={true}>
                    <SettingsProvider value={{ settings, setSettings }}>
                        <DocumentDataProvider value={{ documentDataState, dispatchDocumentData }}>
                            <Router />
                        </DocumentDataProvider>
                    </SettingsProvider>
                </MenuProvider>
            </AppThemeProvider>
        </GestureHandlerRootView>
    )
}

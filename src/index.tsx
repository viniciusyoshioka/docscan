import { useEffect, useReducer, useState } from "react"
import { useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useMMKVString } from "react-native-mmkv"
import { MenuProvider } from "react-native-popup-menu"
import SQLite from "react-native-sqlite-storage"

import { DocumentDatabase, LogDatabase, openAppDatabase, openLogDatabase, setGlobalAppDatabase, setGlobalLogDatabase } from "./database"
import { useKeepAwakeOnDev } from "./hooks"
import { Router } from "./router"
import { cameraSettingsDefault, CameraSettingsProvider, reducerCameraSettings } from "./services/camera"
import { DocumentDataProvider, reducerDocumentData } from "./services/document"
import { logCriticalError, stringfyError } from "./services/log"
import { AppSettingsKeys, setStorageDefaultValues } from "./services/storage"
import { AppThemeProvider, themeDefault, ThemeType } from "./theme"


SQLite.enablePromise(true)


// TODO change database library
export function App() {


    useKeepAwakeOnDev()


    const deviceTheme = useColorScheme()
    const [appTheme, setAppTheme] = useMMKVString(AppSettingsKeys.THEME)
    const isDarkTheme = (appTheme === "auto" && deviceTheme === "dark") || appTheme === "dark"

    const [appDb, setAppDb] = useState<SQLite.SQLiteDatabase>()
    const [logDb, setLogDb] = useState<SQLite.SQLiteDatabase>()
    const [cameraSettingsState, dispatchCameraSettings] = useReducer(reducerCameraSettings, cameraSettingsDefault)
    const [documentDataState, dispatchDocumentData] = useReducer(reducerDocumentData, undefined)


    function getAppTheme() {
        if (isDarkTheme) {
            const { AppDarkTheme } = require("./theme")
            AppDarkTheme.appTheme = appTheme
            AppDarkTheme.switchTheme = setAppTheme
            return AppDarkTheme
        }

        const currentAppTheme = (appTheme ?? themeDefault) as ThemeType
        const { AppLightTheme } = require("./theme")
        AppLightTheme.appTheme = currentAppTheme
        AppLightTheme.switchTheme = setAppTheme
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


    if (!appDb || !logDb) {
        return null
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppThemeProvider value={getAppTheme()}>
                <MenuProvider backHandler={true}>
                    <DocumentDataProvider value={{ documentDataState, dispatchDocumentData }}>
                        <CameraSettingsProvider value={{ cameraSettingsState, dispatchCameraSettings }}>
                            <Router />
                        </CameraSettingsProvider>
                    </DocumentDataProvider>
                </MenuProvider>
            </AppThemeProvider>
        </GestureHandlerRootView>
    )
}

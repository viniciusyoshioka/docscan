import React, { useEffect, useReducer, useState } from "react"
import { useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import KeepAwake from "react-native-keep-awake"
import { MenuProvider } from "react-native-popup-menu"
import SQLite from "react-native-sqlite-storage"
import { ThemeProvider } from "styled-components/native"

import { DocumentDatabase, LogDatabase, openAppDatabase, openLogDatabase, setGlobalAppDatabase, setGlobalLogDatabase, SettingsDatabase } from "@database/"
import { DocumentDataProvider, reducerDocumentData } from "@services/document"
import { logCriticalError } from "@services/log"
import { ColorThemeDark, ColorThemeLight, ColorThemeProvider } from "@services/theme"
import { ThemeType } from "@type/"
import { Router } from "./router"


export function App() {


    const deviceTheme = useColorScheme()

    const [appDb, setAppDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [logDb, setLogDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [theme, setTheme] = useState<ThemeType | undefined>(undefined)
    const [documentDataState, dispatchDocumentData] = useReducer(reducerDocumentData, undefined)


    async function getTheme() {
        const appTheme = await SettingsDatabase.getSettingKey("theme")

        ColorThemeLight.appTheme = appTheme
        ColorThemeLight.switchTheme = switchTheme

        ColorThemeDark.appTheme = appTheme
        ColorThemeDark.switchTheme = switchTheme

        if (appTheme === "auto") {
            if (deviceTheme) {
                setTheme(deviceTheme)
                return
            }
            setTheme("light")
            return
        }
        setTheme(appTheme)
    }

    async function switchTheme(newTheme: ThemeType) {
        await SettingsDatabase.updateSettings("theme", newTheme)
        await getTheme()
    }


    useEffect(() => {
        if (appDb && logDb) {
            getTheme()
        }
    }, [deviceTheme, appDb, logDb])

    useEffect(() => {
        SQLite.enablePromise(true)

        openAppDatabase()
            .then(async (database) => {
                setGlobalAppDatabase(database)
                await DocumentDatabase.createDocumentTable()
                await SettingsDatabase.createSettingsTable()
                setAppDb(database)
            })
            .catch((error) => {
                logCriticalError(`Error opening app database: "${JSON.stringify(error)}"`)
            })

        openLogDatabase()
            .then(async (database) => {
                setGlobalLogDatabase(database)
                await LogDatabase.createLogTable()
                setLogDb(database)
            })
            .catch((error) => {
                logCriticalError(`Error opening log database: "${JSON.stringify(error)}"`)
            })
    }, [])

    useEffect(() => {
        if (__DEV__) {
            KeepAwake.activate()

            return () => KeepAwake.deactivate()
        }
    }, [])


    if (!theme || !appDb || !logDb) {
        return null
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ColorThemeProvider value={(theme === "light") ? ColorThemeLight : ColorThemeDark}>
                <ThemeProvider theme={(theme === "light") ? ColorThemeLight : ColorThemeDark}>
                    <MenuProvider>
                        <DocumentDataProvider value={[documentDataState, dispatchDocumentData]}>
                            <Router />
                        </DocumentDataProvider>
                    </MenuProvider>
                </ThemeProvider>
            </ColorThemeProvider>
        </GestureHandlerRootView>
    )
}

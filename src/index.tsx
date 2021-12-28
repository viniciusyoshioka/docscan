import React, { useEffect, useReducer, useState } from "react"
import { useColorScheme } from "react-native"
import { MenuProvider } from "react-native-popup-menu"
import { ThemeProvider } from "styled-components/native"
import KeepAwake from "react-native-keep-awake"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import SQLite from "react-native-sqlite-storage"

import { Router } from "./router"
import { DarkTheme, LightTheme, ThemeContextProvider } from "./service/theme"
import { themeType } from "./types"
import { DocumentDatabase, LogDatabase, openAppDatabase, openLogDatabase, setGlobalAppDatabase, setGlobalLogDatabase, SettingsDatabase } from "./database"
import { logCriticalError } from "./service/log"
import { DocumentDataProvider, reducerDocumentData } from "./service/document"


export function App() {


    const deviceTheme = useColorScheme()

    const [appDb, setAppDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [logDb, setLogDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [theme, setTheme] = useState<themeType | undefined>(undefined)
    const [documentDataState, dispatchDocumentData] = useReducer(reducerDocumentData, undefined)


    async function getTheme() {
        const readAppTheme = await SettingsDatabase.getSettingKey("theme")

        LightTheme.appTheme = readAppTheme
        LightTheme.switchTheme = switchTheme

        DarkTheme.appTheme = readAppTheme
        DarkTheme.switchTheme = switchTheme

        if (readAppTheme === "auto") {
            if (deviceTheme) {
                setTheme(deviceTheme)
                return
            }
            setTheme("light")
            return
        }
        setTheme(readAppTheme)
    }

    async function switchTheme(newTheme: themeType) {
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
            <ThemeContextProvider value={(theme === "light") ? LightTheme : DarkTheme}>
                <ThemeProvider theme={(theme === "light") ? LightTheme : DarkTheme}>
                    <MenuProvider>
                        <DocumentDataProvider value={[documentDataState, dispatchDocumentData]}>
                            <Router />
                        </DocumentDataProvider>
                    </MenuProvider>
                </ThemeProvider>
            </ThemeContextProvider>
        </GestureHandlerRootView>
    )
}

import React, { useEffect, useReducer, useState } from "react"
import { DevSettings, useColorScheme } from "react-native"
import RNFS from "react-native-fs"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import KeepAwake from "react-native-keep-awake"
import { MenuProvider } from "react-native-popup-menu"
import SQLite from "react-native-sqlite-storage"
import { ThemeProvider } from "styled-components/native"

import { DocumentDatabase, LogDatabase, openAppDatabase, openLogDatabase, setGlobalAppDatabase, setGlobalLogDatabase, SettingsDatabase } from "./database"
import { Router } from "./router"
import { cameraSettingsDefault, CameraSettingsProvider, reducerCameraSettings } from "./services/camera"
import { databaseFolder, fullPathExported, fullPathPdf, fullPathPicture, fullPathRoot, fullPathRootExternal, fullPathTemporary, fullPathTemporaryCompressedPicture, fullPathTemporaryExported, fullPathTemporaryImported } from "./services/constant"
import { DocumentDataProvider, reducerDocumentData } from "./services/document"
import { logCriticalError } from "./services/log"
import { ColorThemeDark, ColorThemeLight, ColorThemeProvider } from "./services/theme"
import { ThemeType } from "./types"


export function App() {


    const deviceTheme = useColorScheme()

    const [appDb, setAppDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [logDb, setLogDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [theme, setTheme] = useState<ThemeType | undefined>(undefined)
    const [cameraSettingsState, dispatchCameraSettings] = useReducer(reducerCameraSettings, cameraSettingsDefault)
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

                database.transaction(tx => {
                    DocumentDatabase.createDocumentTable(tx)
                    SettingsDatabase.createSettingsTable(tx)
                }, (error) => {
                    logCriticalError(`Error creating tables in app database: "${JSON.stringify(error)}"`)
                }, async () => {
                    // TODO try/catch
                    const settings = await SettingsDatabase.getSettings()
                    dispatchCameraSettings({
                        type: "set",
                        payload: {
                            flash: settings.cameraFlash,
                            whiteBalance: settings.cameraWhiteBalance,
                            cameraType: settings.cameraType,
                            cameraId: settings.cameraId,
                        }
                    })

                    setAppDb(database)
                })
            })
            .catch((error) => {
                logCriticalError(`Error opening app database: "${JSON.stringify(error)}"`)
            })

        openLogDatabase()
            .then(async (database) => {
                setGlobalLogDatabase(database)

                database.transaction(tx => {
                    LogDatabase.createLogTable(tx)
                }, (error) => {
                    logCriticalError(`Error opening log database: "${JSON.stringify(error)}"`)
                }, () => {
                    setLogDb(database)
                })
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

    useEffect(() => {
        if (__DEV__) {
            DevSettings.addMenuItem("List all app folders", async () => {
                // App internal folders
                console.log("======================================================================")
                console.log(`fullPathRoot: "${fullPathRoot}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathRoot = await RNFS.readDir(fullPathRoot)
                if (ls_fullPathRoot.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathRoot.forEach((item) => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathPicture: "${fullPathPicture}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathPicture = await RNFS.readDir(fullPathPicture)
                if (ls_fullPathPicture.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathPicture.forEach((item) => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporary: "${fullPathTemporary}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathTemporary = await RNFS.readDir(fullPathTemporary)
                if (ls_fullPathTemporary.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathTemporary.forEach((item) => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporaryExported: "${fullPathTemporaryExported}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathTemporaryExported = await RNFS.readDir(fullPathTemporaryExported)
                if (ls_fullPathTemporaryExported.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathTemporaryExported.forEach((item) => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporaryImported: "${fullPathTemporaryImported}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathTemporaryImported = await RNFS.readDir(fullPathTemporaryImported)
                if (ls_fullPathTemporaryImported.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathTemporaryImported.forEach((item) => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporaryCompressedPicture: "${fullPathTemporaryCompressedPicture}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathTemporaryCompressedPicture = await RNFS.readDir(fullPathTemporaryCompressedPicture)
                if (ls_fullPathTemporaryCompressedPicture.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathTemporaryCompressedPicture.forEach((item) => {
                        console.log(item.path)
                    })
                }



                // App external folders
                console.log("======================================================================")
                console.log(`fullPathRootExternal: "${fullPathRootExternal}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathRootExternal = await RNFS.readDir(fullPathRootExternal)
                if (ls_fullPathRootExternal.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathRootExternal.forEach((item) => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathExported: "${fullPathExported}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathExported = await RNFS.readDir(fullPathExported)
                if (ls_fullPathExported.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathExported.forEach((item) => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathPdf: "${fullPathPdf}"`)
                console.log("----------------------------------------------------------------------")
                const ls_fullPathPdf = await RNFS.readDir(fullPathPdf)
                if (ls_fullPathPdf.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_fullPathPdf.forEach((item) => {
                        console.log(item.path)
                    })
                }



                // App database folder
                console.log("======================================================================")
                console.log(`databaseFolder: "${databaseFolder}"`)
                console.log("----------------------------------------------------------------------")
                const ls_databaseFolder = await RNFS.readDir(databaseFolder)
                if (ls_databaseFolder.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    ls_databaseFolder.forEach((item) => {
                        console.log(item.path)
                    })
                }
            })
        }
    })


    if (!theme || !appDb || !logDb) {
        return null
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ColorThemeProvider value={(theme === "light") ? ColorThemeLight : ColorThemeDark}>
                <ThemeProvider theme={(theme === "light") ? ColorThemeLight : ColorThemeDark}>
                    <MenuProvider>
                        <DocumentDataProvider value={{ documentDataState, dispatchDocumentData }}>
                            <CameraSettingsProvider value={{ cameraSettingsState, dispatchCameraSettings }}>
                                <Router />
                            </CameraSettingsProvider>
                        </DocumentDataProvider>
                    </MenuProvider>
                </ThemeProvider>
            </ColorThemeProvider>
        </GestureHandlerRootView>
    )
}

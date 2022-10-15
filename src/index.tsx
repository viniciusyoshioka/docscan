import { useEffect, useReducer, useState } from "react"
import { Alert, DevSettings, StatusBar, useColorScheme } from "react-native"
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
import { log, logCriticalError } from "./services/log"
import { AppThemeDark, AppThemeLight, AppThemeProvider, themeDefault } from "./services/theme"
import { ThemeType } from "./types"


SQLite.enablePromise(true)


export function App() {


    const deviceTheme = useColorScheme()

    const [appDb, setAppDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [logDb, setLogDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined)
    const [theme, setTheme] = useState<ThemeType | undefined>(undefined)
    const [cameraSettingsState, dispatchCameraSettings] = useReducer(reducerCameraSettings, cameraSettingsDefault)
    const [documentDataState, dispatchDocumentData] = useReducer(reducerDocumentData, undefined)


    async function getTheme() {
        let appTheme: ThemeType = themeDefault
        try {
            appTheme = await SettingsDatabase.getSettingKey("theme")
        } catch (error) {
            log.error(`Error getting theme from database: "${JSON.stringify(error)}". Fallback to default theme`)
        }

        AppThemeLight.appTheme = appTheme
        AppThemeLight.switchTheme = switchTheme

        AppThemeDark.appTheme = appTheme
        AppThemeDark.switchTheme = switchTheme

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
        try {
            await SettingsDatabase.updateSettings("theme", newTheme)
        } catch (error) {
            log.error(`Error updating theme in settings database: "${JSON.stringify(error)}". Previews value was kept`)
            Alert.alert(
                "Aviso",
                "Erro salvando tema"
            )
        }

        await getTheme()
    }


    useEffect(() => {
        openAppDatabase()
            .then(async database => {
                setGlobalAppDatabase(database)

                database.transaction(tx => {
                    DocumentDatabase.createDocumentTable(tx)
                    SettingsDatabase.createSettingsTable(tx)
                }, error => {
                    logCriticalError(`Error creating tables in app database: "${JSON.stringify(error)}"`)
                }, async () => {
                    try {
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
                    } catch (error) {
                        log.error(`Error getting all settings from settings database: "${JSON.stringify(error)}". Fallback to default settings`)
                    }

                    setAppDb(database)
                })
            })
            .catch(error => {
                logCriticalError(`Error opening app database: "${JSON.stringify(error)}"`)
            })

        openLogDatabase()
            .then(async database => {
                setGlobalLogDatabase(database)

                database.transaction(tx => {
                    LogDatabase.createLogTable(tx)
                }, error => {
                    logCriticalError(`Error creating tables in log database: "${JSON.stringify(error)}"`)
                }, () => {
                    setLogDb(database)
                })
            })
            .catch(error => {
                logCriticalError(`Error opening log database: "${JSON.stringify(error)}"`)
            })
    }, [])

    useEffect(() => {
        if (appDb && logDb) {
            getTheme()
        }
    }, [deviceTheme, appDb, logDb])

    useEffect(() => {
        if (theme) {
            StatusBar.setBarStyle("light-content")
            StatusBar.setBackgroundColor(theme === "dark" ? AppThemeDark.color.header_background : AppThemeLight.color.header_background)
        }
    }, [theme])


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
                const lsFullPathRoot = await RNFS.readDir(fullPathRoot)
                if (lsFullPathRoot.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathRoot.forEach(item => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathPicture: "${fullPathPicture}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathPicture = await RNFS.readDir(fullPathPicture)
                if (lsFullPathPicture.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathPicture.forEach(item => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporary: "${fullPathTemporary}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathTemporary = await RNFS.readDir(fullPathTemporary)
                if (lsFullPathTemporary.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathTemporary.forEach(item => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporaryExported: "${fullPathTemporaryExported}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathTemporaryExported = await RNFS.readDir(fullPathTemporaryExported)
                if (lsFullPathTemporaryExported.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathTemporaryExported.forEach(item => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporaryImported: "${fullPathTemporaryImported}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathTemporaryImported = await RNFS.readDir(fullPathTemporaryImported)
                if (lsFullPathTemporaryImported.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathTemporaryImported.forEach(item => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathTemporaryCompressedPicture: "${fullPathTemporaryCompressedPicture}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathTemporaryCompressedPicture = await RNFS.readDir(fullPathTemporaryCompressedPicture)
                if (lsFullPathTemporaryCompressedPicture.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathTemporaryCompressedPicture.forEach(item => {
                        console.log(item.path)
                    })
                }



                // App external folders
                console.log("======================================================================")
                console.log(`fullPathRootExternal: "${fullPathRootExternal}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathRootExternal = await RNFS.readDir(fullPathRootExternal)
                if (lsFullPathRootExternal.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathRootExternal.forEach(item => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathExported: "${fullPathExported}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathExported = await RNFS.readDir(fullPathExported)
                if (lsFullPathExported.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathExported.forEach(item => {
                        console.log(item.path)
                    })
                }

                console.log("======================================================================")
                console.log(`fullPathPdf: "${fullPathPdf}"`)
                console.log("----------------------------------------------------------------------")
                const lsFullPathPdf = await RNFS.readDir(fullPathPdf)
                if (lsFullPathPdf.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsFullPathPdf.forEach(item => {
                        console.log(item.path)
                    })
                }



                // App database folder
                console.log("======================================================================")
                console.log(`databaseFolder: "${databaseFolder}"`)
                console.log("----------------------------------------------------------------------")
                const lsDatabaseFolder = await RNFS.readDir(databaseFolder)
                if (lsDatabaseFolder.length === 0) {
                    console.log("Pasta vazia")
                } else {
                    lsDatabaseFolder.forEach(item => {
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
            <AppThemeProvider value={(theme === "light") ? AppThemeLight : AppThemeDark}>
                <ThemeProvider theme={(theme === "light") ? AppThemeLight : AppThemeDark}>
                    <MenuProvider backHandler={true}>
                        <DocumentDataProvider value={{ documentDataState, dispatchDocumentData }}>
                            <CameraSettingsProvider value={{ cameraSettingsState, dispatchCameraSettings }}>
                                <Router />
                            </CameraSettingsProvider>
                        </DocumentDataProvider>
                    </MenuProvider>
                </ThemeProvider>
            </AppThemeProvider>
        </GestureHandlerRootView>
    )
}

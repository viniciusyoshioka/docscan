import React, { useCallback, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { MenuProvider } from "react-native-popup-menu"
import { ThemeProvider } from "styled-components/native"
import KeepAwake from "react-native-keep-awake"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { Router } from "./router"
import { readTheme, writeTheme } from "./service/storage"
import { DarkTheme, join, LightTheme, SwitchThemeContextProvider, ThemeContextProvider, themeType } from "./service/theme"


export function App() {


    const deviceTheme = useColorScheme()
    const [appTheme, setAppTheme] = useState<themeType>("auto")
    const [theme, setTheme] = useState<themeType>()


    const getTheme = useCallback(async () => {
        const readAppTheme = await readTheme()
        if (readAppTheme === "auto") {
            if (deviceTheme) {
                setAppTheme(readAppTheme)
                setTheme(deviceTheme)
                return
            }
            setAppTheme(readAppTheme)
            setTheme("light")
            return
        }
        setAppTheme(readAppTheme)
        setTheme(readAppTheme)
    }, [deviceTheme])

    const switchTheme = useCallback(async (newTheme: themeType) => {
        await writeTheme(newTheme)
        await getTheme()
    }, [])


    useEffect(() => {
        getTheme()
    }, [deviceTheme])

    useEffect(() => {
        if (__DEV__) {
            KeepAwake.activate()

            return () => KeepAwake.deactivate()
        }
    }, [])


    if (theme === undefined) {
        return null
    }


    return (
        <GestureHandlerRootView>
            <ThemeContextProvider value={(theme === "light") ? join(LightTheme, appTheme) : join(DarkTheme, appTheme)}>
                <SwitchThemeContextProvider value={switchTheme}>
                    <ThemeProvider theme={(theme === "light") ? join(LightTheme, appTheme) : join(DarkTheme, appTheme)}>
                        <MenuProvider>
                            <Router />
                        </MenuProvider>
                    </ThemeProvider>
                </SwitchThemeContextProvider>
            </ThemeContextProvider>
        </GestureHandlerRootView>
    )
}

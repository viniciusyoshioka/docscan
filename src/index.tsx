import React, { useCallback, useEffect, useState } from "react"
import { Appearance, useColorScheme } from "react-native"
import { MenuProvider } from "react-native-popup-menu"
import { ThemeProvider } from "styled-components/native"

import { Router } from "./router"
import { readTheme, writeTheme } from "./service/storage"
import { DarkTheme, join, LightTheme, SwitchThemeContextProvider, ThemeContextProvider, themeType } from "./service/theme"


export function App() {


    const [theme, setTheme] = useState<themeType>()
    const [deviceTheme, setDeviceTheme] = useState(useColorScheme())
    const [appTheme, setAppTheme] = useState<themeType>("auto")


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
        function listener(preferences: Appearance.AppearancePreferences) {
            if (preferences.colorScheme) {
                setDeviceTheme(preferences.colorScheme)
                return
            }
            setDeviceTheme("light")
        }
        Appearance.addChangeListener(listener)
        return () => Appearance.removeChangeListener(listener)
    }, [])


    if (theme === undefined) {
        return null
    }


    return (
        <ThemeContextProvider value={(theme === "light") ? join(LightTheme, appTheme) : join(DarkTheme, appTheme)}>
            <SwitchThemeContextProvider value={switchTheme}>
                <ThemeProvider theme={(theme === "light") ? join(LightTheme, appTheme) : join(DarkTheme, appTheme)}>
                    <MenuProvider>
                        <Router />
                    </MenuProvider>
                </ThemeProvider>
            </SwitchThemeContextProvider>
        </ThemeContextProvider>
    )
}

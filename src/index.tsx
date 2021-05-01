import React, { useCallback, useEffect, useState } from "react"
import { Appearance, useColorScheme } from "react-native"
import { MenuProvider } from "react-native-popup-menu"
import { ThemeProvider } from "styled-components/native"

import { Router } from "./router"
import { themeAuto, themeLight } from "./service/constant"
import { readTheme, writeTheme } from "./service/storage"
import { DarkTheme, join, LightTheme, SwitchThemeContextProvider, ThemeContextProvider } from "./service/theme"


export function App() {


    const [theme, setTheme] = useState("")
    const [deviceTheme, setDeviceTheme] = useState(useColorScheme())
    const [appTheme, setAppTheme] = useState("")


    const getTheme = useCallback(async () => {
        const readAppTheme = await readTheme()
        if (readAppTheme === themeAuto) {
            if (deviceTheme) {
                setAppTheme(readAppTheme)
                setTheme(deviceTheme)
                return
            }
            setAppTheme(readAppTheme)
            setTheme(themeLight)
            return
        }
        setAppTheme(readAppTheme)
        setTheme(readAppTheme)
    }, [deviceTheme])

    const switchTheme = useCallback(async (newTheme: string) => {
        await writeTheme(newTheme)
        await getTheme()
    }, [])


    // useEffect(() => {
    //     getTheme()
    // }, [deviceTheme])
    // 
    // useEffect(() => {
    //     function listener(preferences: Appearance.AppearancePreferences) {
    //         setDeviceTheme(preferences.colorScheme)
    //     }
    //     Appearance.addChangeListener(listener)
    //     return () => Appearance.removeChangeListener(listener)
    // }, [])


    useEffect(() => {
        getTheme()

        function listener(preferences: Appearance.AppearancePreferences) {
            setDeviceTheme(preferences.colorScheme)
        }

        Appearance.addChangeListener(listener)
        return () => Appearance.removeChangeListener(listener)
    }, [getTheme])

    useEffect(() => {
        getTheme()
    }, [deviceTheme])


    if (theme === "") {
        return null
    }


    return (
        <ThemeContextProvider value={(theme === themeLight) ? join(LightTheme, appTheme) : join(DarkTheme, appTheme)}>
            <SwitchThemeContextProvider value={switchTheme}>
                <ThemeProvider theme={(theme === themeLight) ? join(LightTheme, appTheme) : join(DarkTheme, appTheme)}>
                    <MenuProvider>
                        <Router />
                    </MenuProvider>
                </ThemeProvider>
            </SwitchThemeContextProvider>
        </ThemeContextProvider>
    )
}

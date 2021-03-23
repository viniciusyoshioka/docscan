import React, { useCallback, useEffect, useState } from "react"
import { Appearance, useColorScheme } from "react-native"
import { ThemeProvider } from "styled-components/native"

import Router from "./router"
import { themeAuto, themeLight } from "./service/constant"
import { readTheme, writeTheme } from "./service/storage"
import { DarkTheme, LightTheme, SwitchThemeContext, ThemeContext } from "./service/theme"


export default function App() {


    const [theme, setTheme] = useState("")
    const [deviceTheme, setDeviceTheme] = useState(useColorScheme())


    const getTheme = useCallback(async () => {
        const appTheme = await readTheme()
        if (appTheme === themeAuto) {
            if (deviceTheme) {
                setTheme(deviceTheme)
            } else {
                setTheme(themeLight)
            }
        } else {
            setTheme(appTheme)
        }
    }, [deviceTheme])

    const switchTheme = useCallback(async (newTheme: string) => {
        await writeTheme(newTheme)
        await getTheme()
    }, [])


    useEffect(() => {
        const themeListener: any = Appearance.addChangeListener(({ colorScheme }) => {
            setDeviceTheme(colorScheme)
        })
        return () => {
            Appearance.removeChangeListener(themeListener)
        }
    }, [])

    useEffect(() => {
        getTheme()
    }, [deviceTheme])


    if (theme === "") {
        return null
    }


    return (
        <ThemeContext.Provider value={(theme === themeLight) ? LightTheme : DarkTheme}>
            <SwitchThemeContext.Provider value={switchTheme}>
                <ThemeProvider theme={(theme === themeLight) ? LightTheme : DarkTheme}>
                    <Router />
                </ThemeProvider>
            </SwitchThemeContext.Provider>            
        </ThemeContext.Provider>
    )    
}

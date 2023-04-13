import { ThemeProvider as ElementiumThemeProvider } from "@elementium/native"
import { createContext, ProviderProps, useContext, useEffect } from "react"
import { StatusBar, StatusBarStyle } from "react-native"
import { ThemeProvider as StyledThemeProvider } from "styled-components/native"

import { AppLightTheme } from "./light"
import { AppThemeType } from "./types"


const AppThemeContext = createContext<AppThemeType>(AppLightTheme)


export function AppThemeProvider(props: ProviderProps<AppThemeType>) {


    useEffect(() => {
        const statusBarStyle: StatusBarStyle = props.value.isDark ? "light-content" : "dark-content"
        StatusBar.setBarStyle(statusBarStyle)
        StatusBar.setBackgroundColor(props.value.color.background)
    }, [props.value.isDark, props.value.color.background])


    return (
        <AppThemeContext.Provider {...props}>
            <ElementiumThemeProvider value={props.value}>
                <StyledThemeProvider theme={props.value}>
                    {props.children}
                </StyledThemeProvider>
            </ElementiumThemeProvider>
        </AppThemeContext.Provider>
    )
}


export function useAppTheme() {
    return useContext(AppThemeContext)
}

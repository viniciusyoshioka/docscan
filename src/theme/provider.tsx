import { ThemeProvider as ElementiumThemeProvider } from "@elementium/native"
import { createContext, ProviderProps, useContext } from "react"
import { ThemeProvider as StyledThemeProvider } from "styled-components/native"

import { AppLightTheme } from "./light"
import { AppThemeType } from "./types"


const AppThemeContext = createContext<AppThemeType>(AppLightTheme)


export function AppThemeProvider(props: ProviderProps<AppThemeType>) {
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

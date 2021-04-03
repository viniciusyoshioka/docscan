import { createContext, useContext } from "react"

import { themeDark, themeLight } from "./constant"


export interface ColorTheme {
    name: string,
    appTheme: string,
    color: {
        background: string,
        backgroundDark: string,
        backgroundLight: string,
        color: string,
        colorDark: string,
        colorLight: string,
    }
}


export const LightTheme: ColorTheme = {
    name: themeLight,
    appTheme: "",
    color: {
        background: "rgb(255, 255, 255)",
        backgroundDark: "rgb(190, 190, 190)",
        backgroundLight: "rgb(255, 255, 255)",
        color: "rgb(0, 0, 0)",
        colorDark: "rgb(0, 0, 0)",
        colorLight: "rgb(30, 30, 30)",
    }
}

export const DarkTheme: ColorTheme = {
    name: themeDark,
    appTheme: "",
    color: {
        background: "rgb(35, 35, 35)",
        backgroundDark: "rgb(15, 15, 15)",
        backgroundLight: "rgb(50, 50, 50)",
        color: "rgb(200, 200, 200)",
        colorDark: "rgb(128, 128, 128)",
        colorLight: "rgb(230, 230, 230)",
    }
}


export const ThemeContext = createContext(LightTheme)

export const SwitchThemeContext = createContext(async (newTheme: string) => {})


export function useTheme() {
    const theme = useContext(ThemeContext)
    return theme
}

export function useSwitchTheme() {
    const switchTheme = useContext(SwitchThemeContext)
    return switchTheme
}


export interface styledProps {
    theme: ColorTheme
}


export function join(theme: ColorTheme, value: string): ColorTheme {
    theme["appTheme"] = value
    return theme
}

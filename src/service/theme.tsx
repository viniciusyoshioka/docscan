import { createContext } from "react"

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
        background: "rgb(30, 30, 30)",
        backgroundDark: "rgb(20, 20, 20)",
        backgroundLight: "rgb(45, 45, 45)",
        color: "rgb(160, 160, 160)",
        colorDark: "rgb(100, 100, 100)",
        colorLight: "rgb(200, 200, 200)",
    }
}


export const ThemeContext = createContext(LightTheme)

export const SwitchThemeContext = createContext(async (newTheme: string) => {})


export interface styledProps {
    theme: ColorTheme
}


export function join(theme: ColorTheme, value: string): ColorTheme {
    theme["appTheme"] = value
    return theme
}

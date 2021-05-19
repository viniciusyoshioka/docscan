import { createContext, useContext } from "react"


export type themeType = "auto" | "light" | "dark"


export const themeDefault: themeType = "auto"


export type ColorTheme = {
    name: themeType,
    appTheme: themeType,
    color: {
        header_background: string,
        header_color: string,

        subHeader_background: string,
        subHeader_color: string,

        screen_background: string,
        screen_colorFirst: string,

        popupMenuButton_background: string,
        popupMenuButton_color: string,

        documentItem_background: string,
        documentItem_colorFirst: string,
        documentItem_colorSecond: string,

        // checkBox_background: string,
        // checkBox_color: string,

        checkBox_unchecked_background: string,
        checkBox_unchecked_color: string,

        checkBox_checked_background: string,
        checkBox_checked_color: string,

        imageItem_background: string,
        imageItem_color: string,

        settingsButton_background: string,
        settingsButton_colorFirst: string,
        settingsButton_colorSecond: string,

        fileExplorerItem_background: string,
        fileExplorerItem_colorFirst: string,
        fileExplorerItem_colorSecond: string,

        pictureItem_background: string,
        pictureItem_color: string,

        modal_background: string,
        modal_color: string,

        modalButton_background: string,
        modalButton_color: string,

        input_background: string,
        input_color: string,
        input_placeholder: string,
        input_border: string,

        // input_inactive_background: string,
        // input_inactive_color: string,
        // input_inactive_placeholder: string,
        // input_inactive_border: string,

        // input_active_background: string,
        // input_active_color: string,
        // input_active_placeholder: string,
        // input_active_border: string,

        radioButton_background: string,
        radioButton_color: string,

        // radioButton_unchecked_background: string,
        // radioButton_unchecked_color: string,

        // radioButton_checked_background: string,
        // radioButton_checked_color: string,
    }
}


export const LightTheme: ColorTheme = {
    name: "light",
    appTheme: "auto",
    color: {
        header_background: "rgb(255, 255, 255)",
        header_color: "rgb(0, 0, 0)",

        subHeader_background: "rgb(255, 255, 255)",
        subHeader_color: "rgb(0, 0, 0)",

        screen_background: "rgb(255, 255, 255)",
        screen_colorFirst: "rgb(64, 64, 64)",

        popupMenuButton_background: "rgb(255, 255, 255)",
        popupMenuButton_color: "rgb(0, 0, 0)",

        documentItem_background: "rgb(255, 255, 255)",
        documentItem_colorFirst: "rgb(0, 0, 0)",
        documentItem_colorSecond: "rgb(30, 30, 30)",

        // checkBox_background: "rgb(0, 0, 0)",
        // checkBox_color: "rgb(0, 0, 0)",

        checkBox_unchecked_background: "rgb(0, 0, 0)",
        checkBox_unchecked_color: "rgb(0, 0, 0)",

        checkBox_checked_background: "rgb(0, 0, 0)",
        checkBox_checked_color: "rgb(0, 0, 0)",

        imageItem_background: "rgb(255, 255, 255)",
        imageItem_color: "rgb(0, 0, 0)",

        settingsButton_background: "transparent",
        settingsButton_colorFirst: "rgb(0, 0, 0)",
        settingsButton_colorSecond: "rgb(30, 30, 30)",

        fileExplorerItem_background: "transparent",
        fileExplorerItem_colorFirst: "rgb(0, 0, 0)",
        fileExplorerItem_colorSecond: "rgb(64, 64, 64)",

        pictureItem_background: "rgb(240, 240, 240)",
        pictureItem_color: "rgb(0, 0, 0)",

        modal_background: "rgb(255, 255, 255)",
        modal_color: "rgb(0, 0, 0)",

        modalButton_background: "transparent",
        modalButton_color: "rgb(0, 0, 0)",

        input_background: "rgb(255, 255, 255)",
        input_color: "rgb(0, 0, 0)",
        input_placeholder: "rgb(100, 100, 100)",
        input_border: "rgb(0, 0, 0)",

        // input_inactive_background: "rgb(0, 0, 0)",
        // input_inactive_color: "rgb(0, 0, 0)",
        // input_inactive_placeholder: "rgb(0, 0, 0)",
        // input_inactive_border: "rgb(0, 0, 0)",

        // input_active_background: "rgb(0, 0, 0)",
        // input_active_color: "rgb(0, 0, 0)",
        // input_active_placeholder: "rgb(0, 0, 0)",
        // input_active_border: "rgb(0, 0, 0)",

        radioButton_background: "rgb(0, 0, 0)",
        radioButton_color: "rgb(0, 0, 0)",

        // radioButton_unchecked_background: "rgb(0, 0, 0)",
        // radioButton_unchecked_color: "rgb(0, 0, 0)",

        // radioButton_checked_background: "rgb(0, 0, 0)",
        // radioButton_checked_color: "rgb(0, 0, 0)",
    }
}

export const DarkTheme: ColorTheme = {
    name: "dark",
    appTheme: "auto",
    color: {
        header_background: "rgb(30, 30, 30)",
        header_color: "rgb(220, 220, 220)",

        subHeader_background: "rgb(30, 30, 30)",
        subHeader_color: "rgb(150, 150, 150)",

        screen_background: "rgb(18, 18, 18)",
        screen_colorFirst: "rgb(150, 150, 150)",

        popupMenuButton_background: "rgb(45, 45, 45)",
        popupMenuButton_color: "rgb(220, 220, 220)",

        documentItem_background: "rgb(30, 30, 30)",
        documentItem_colorFirst: "rgb(220, 220, 220)",
        documentItem_colorSecond: "rgb(150, 150, 150)",

        checkBox_unchecked_background: "transparent",
        checkBox_unchecked_color: "rgb(220, 220, 220)",

        checkBox_checked_background: "transparent",
        checkBox_checked_color: "rgb(220, 220, 220)",

        imageItem_background: "rgb(30, 30, 30)",
        imageItem_color: "rgb(220, 220, 220)",

        settingsButton_background: "transparent",
        settingsButton_colorFirst: "rgb(220, 220, 220)",
        settingsButton_colorSecond: "rgb(150, 150, 150)",

        fileExplorerItem_background: "transparent",
        fileExplorerItem_colorFirst: "rgb(220, 220, 220)",
        fileExplorerItem_colorSecond: "rgb(150, 150, 150)",

        pictureItem_background: "rgb(30, 30, 30)",
        pictureItem_color: "rgb(220, 220, 220)",

        modal_background: "rgb(30, 30, 30)",
        modal_color: "rgb(220, 220, 220)",

        modalButton_background: "transparent",
        modalButton_color: "rgb(220, 220, 220)",

        input_background: "rgb(0, 0, 0)",
        input_color: "rgb(220, 220, 220)",
        input_placeholder: "rgb(150, 150, 150)",
        input_border: "rgb(220, 220, 220)",

        // input_inactive_background: "rgb(0, 0, 0)",
        // input_inactive_color: "rgb(0, 0, 0)",
        // input_inactive_placeholder: "rgb(0, 0, 0)",
        // input_inactive_border: "rgb(0, 0, 0)",

        // input_active_background: "rgb(0, 0, 0)",
        // input_active_color: "rgb(0, 0, 0)",
        // input_active_placeholder: "rgb(0, 0, 0)",
        // input_active_border: "rgb(0, 0, 0)",

        radioButton_background: "rgb(220, 220, 220)",
        radioButton_color: "rgb(220, 220, 220)",

        // radioButton_unchecked_background: "rgb(0, 0, 0)",
        // radioButton_unchecked_color: "rgb(0, 0, 0)",

        // radioButton_checked_background: "rgb(0, 0, 0)",
        // radioButton_checked_color: "rgb(0, 0, 0)",
    }
}


const ThemeContext = createContext(LightTheme)

export const ThemeContextProvider = ThemeContext.Provider

export function useTheme(): ColorTheme {
    const theme = useContext(ThemeContext)
    return theme
}


const SwitchThemeContext = createContext(async (_newTheme: themeType) => { })

export const SwitchThemeContextProvider = SwitchThemeContext.Provider

export function useSwitchTheme(): (newTheme: themeType) => Promise<void> {
    const switchTheme = useContext(SwitchThemeContext)
    return switchTheme
}


export interface styledProps {
    theme: ColorTheme
}


export function join(theme: ColorTheme, value: themeType): ColorTheme {
    theme["appTheme"] = value
    return theme
}

import { createContext, useContext } from "react"

import { ColorTheme, ThemeType } from "@type/"


export const themeDefault: ThemeType = "auto"


export const ColorThemeLight: ColorTheme = {
    name: "light",
    appTheme: "auto",
    switchTheme: () => { },
    color: {
        header_background: "rgb(60, 100, 220)",
        header_color: "rgb(255, 255, 255)",
        header_ripple: "rgb(120, 155, 235)",

        subHeader_background: "rgb(60, 100, 220)",
        subHeader_color: "rgb(255, 255, 255)",

        screen_background: "rgb(245, 245, 245)",
        screen_color: "rgb(0, 0, 0)",

        menuItem_background: "rgb(255, 255, 255)",
        menuItem_color: "rgb(0, 0, 0)",
        menuItem_ripple: "rgb(230, 230, 230)",

        documentItem_background: "rgb(255, 255, 255)",
        documentItem_color: "rgb(0, 0, 0)",
        documentItem_selected_background: "rgb(60, 100, 220)",
        documentItem_selected_color: "rgb(90, 90, 90)",
        documentItem_ripple: "rgb(230, 230, 230)",

        noteItem_background: "rgb(255, 255, 255)",
        noteItem_color: "rgb(0, 0, 0)",
        noteItem_selected_background: "rgb(60, 100, 220)",
        noteItem_selected_color: "rgb(90, 90, 90)",
        noteItem_ripple: "rgb(230, 230, 230)",

        imageItem_background: "rgb(255, 255, 255)",
        imageItem_color: "rgb(0, 0, 0)",
        imageItem_selected_background: "rgb(60, 100, 220)",
        imageItem_selected_color: "rgb(255, 255, 255)",

        pictureItem_background: "rgb(255, 255, 255)",
        pictureItem_color: "rgb(0, 0, 0)",
        pictureItem_selected_background: "rgb(60, 100, 220)",
        pictureItem_selected_color: "rgb(255, 255, 255)",

        listItem_background: "rgb(255, 255, 255)",
        listItem_color: "rgb(0, 0, 0)",
        listItem_ripple: "rgb(230, 230, 230)",

        modal_background: "rgb(255, 255, 255)",
        modal_color: "rgb(0, 0, 0)",

        input_background: "rgb(230, 230, 230)",
        input_color: "rgb(0, 0, 0)",
        input_placeholder: "rgb(100, 100, 100)",
        input_unfocus_border: "rgb(170, 170, 170)",
        input_focus_border: "rgb(60, 100, 220)",
        input_selection: "rgb(120, 155, 235)",

        button_background: "rgb(60, 100, 220)",
        button_color: "rgb(255, 255, 255)",
        button_ripple: "rgb(120, 155, 235)",

        radioButton_checked_color: "rgb(60, 100, 220)",
        radioButton_unchecked_color: "rgb(0, 0, 0)",

        checkButton_checked_color: "rgb(60, 100, 220)",
        checkButton_unchecked_color: "rgb(0, 0, 0)",
    },
    opacity: {
        headerEmphasis: 1,
        highEmphasis: 0.87,
        mediumEmphasis: 0.6,
        disabled: 0.38,
    },
}

export const ColorThemeDark: ColorTheme = {
    name: "dark",
    appTheme: "auto",
    switchTheme: () => { },
    color: {
        header_background: "rgb(30, 30, 30)",
        header_color: "rgb(255, 255, 255)",
        header_ripple: "rgb(50, 50, 50)",

        subHeader_background: "rgb(30, 30, 30)",
        subHeader_color: "rgb(255, 255, 255)",

        screen_background: "rgb(18, 18, 18)",
        screen_color: "rgb(255, 255, 255)",

        menuItem_background: "rgb(45, 45, 45)",
        menuItem_color: "rgb(255, 255, 255)",
        menuItem_ripple: "rgb(60, 60, 60)",

        documentItem_background: "rgb(30, 30, 30)",
        documentItem_color: "rgb(255, 255, 255)",
        documentItem_selected_background: "rgb(180, 200, 255)",
        documentItem_selected_color: "rgb(180, 180, 180)",
        documentItem_ripple: "rgb(50, 50, 50)",

        noteItem_background: "rgb(30, 30, 30)",
        noteItem_color: "rgb(255, 255, 255)",
        noteItem_selected_background: "rgb(180, 200, 255)",
        noteItem_selected_color: "rgb(180, 180, 180)",
        noteItem_ripple: "rgb(50, 50, 50)",

        imageItem_background: "rgb(30, 30, 30)",
        imageItem_color: "rgb(255, 255, 255)",
        imageItem_selected_background: "rgb(180, 200, 255)",
        imageItem_selected_color: "rgb(255, 255, 255)",

        pictureItem_background: "rgb(30, 30, 30)",
        pictureItem_color: "rgb(255, 255, 255)",
        pictureItem_selected_background: "rgb(180, 200, 255)",
        pictureItem_selected_color: "rgb(255, 255, 255)",

        listItem_background: "rgb(18, 18, 18)",
        listItem_color: "rgb(255, 255, 255)",
        listItem_ripple: "rgb(40, 40, 40)",

        modal_background: "rgb(35, 35, 35)",
        modal_color: "rgb(255, 255, 255)",

        input_background: "rgb(30, 30, 30)",
        input_color: "rgb(220, 220, 220)",
        input_placeholder: "rgb(150, 150, 150)",
        input_unfocus_border: "rgb(80, 80, 80)",
        input_focus_border: "rgb(180, 200, 255)",
        input_selection: "rgb(100, 100, 230)",

        button_background: "rgb(30, 30, 30)",
        button_color: "rgb(255, 255, 255)",
        button_ripple: "rgb(50, 50, 50)",

        radioButton_checked_color: "rgb(180, 200, 255)",
        radioButton_unchecked_color: "rgb(255, 255, 255)",

        checkButton_checked_color: "rgb(180, 200, 255)",
        checkButton_unchecked_color: "rgb(255, 255, 255)",
    },
    opacity: {
        headerEmphasis: 0.87,
        highEmphasis: 0.87,
        mediumEmphasis: 0.6,
        disabled: 0.38,
    },
}


const ColorThemeContext = createContext(ColorThemeLight)

export const ColorThemeProvider = ColorThemeContext.Provider

export function useColorTheme(): ColorTheme {
    return useContext(ColorThemeContext)
}

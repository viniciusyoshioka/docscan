import { DarkTheme as ElementiumDarkTheme } from "@elementium/native"

import { AppThemeType } from "./types"


export const AppDarkTheme: AppThemeType = {
    ...ElementiumDarkTheme,
    switchTheme: () => {},
}

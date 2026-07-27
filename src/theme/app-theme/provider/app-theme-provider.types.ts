import type { MaterialTheme } from 'react-material-design-provider'
import {
  MaterialDarkTheme,
  MaterialLightTheme,
} from 'react-material-design-provider'
import type { MD3Theme } from 'react-native-paper'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

import type { AppTheme } from '../app-theme.types.ts'
import { AppThemeDark, AppThemeLight } from '../themes'


export enum ThemeName {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}


export type ThemeObject = {
  appTheme: AppTheme
  materialTheme: MaterialTheme
  paperTheme: MD3Theme
}


type Themes = {
  [key in ThemeName]: ThemeObject
}

export const THEMES: Themes = {
  LIGHT: {
    appTheme: AppThemeLight,
    materialTheme: MaterialLightTheme,
    paperTheme: MD3LightTheme,
  },
  DARK: {
    appTheme: AppThemeDark,
    materialTheme: MaterialDarkTheme,
    paperTheme: MD3DarkTheme,
  },
}

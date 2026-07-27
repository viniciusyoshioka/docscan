import type { PartialDeep } from 'type-fest'


export enum Theme {
  AUTO = 'AUTO',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}


export interface Settings {
  theme: Theme
}


export interface SettingsStore {
  settings: Settings
  setSettings: (settings: PartialDeep<Settings>) => void
}

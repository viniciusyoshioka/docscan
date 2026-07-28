import type { PartialDeep } from 'type-fest'


export enum CameraFlash {
  AUTO = 'auto',
  ON = 'on',
  OFF = 'off',
}

export enum CameraPosition {
  FRONT = 'front',
  BACK = 'back',
}

export enum CameraRatio {
  RATIO_4_3 = '4:3',
  RATIO_16_9 = '16:9',
}


export enum Theme {
  AUTO = 'AUTO',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}


export interface Settings {
  camera: {
    flash: CameraFlash
    position: CameraPosition
    ratio: CameraRatio
  }
  theme: Theme
}


export interface SettingsStore {
  settings: Settings
  setSettings: (settings: PartialDeep<Settings>) => void
}

import { PartialDeep } from "type-fest"

import { CameraFlash, CameraPosition, CameraRatio, Theme } from "./settings"


export type Settings = {
  camera: {
    flash: CameraFlash
    position: CameraPosition
    ratio: CameraRatio
  }
  theme: Theme
}


export type SettingsStore = {
  settings: Settings
  setSettings: (settings: PartialDeep<Settings>) => void
}

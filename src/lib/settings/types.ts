import { PartialDeep } from "type-fest"

import { CameraFlash, CameraPosition, CameraRatio } from "./camera"
import { ThemeType } from "./theme"


export type Settings = {
  camera: {
    flash: CameraFlash
    position: CameraPosition
    ratio: CameraRatio
  }
  theme: ThemeType
}


export type SettingsStore = {
  settings: Settings
  setSettings: (settings: PartialDeep<Settings>) => void
}

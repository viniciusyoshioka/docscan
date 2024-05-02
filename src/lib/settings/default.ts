import {
  defaultCameraFlash,
  defaultCameraPosition,
  defaultCameraRatio,
  defaultTheme,
} from "./settings"
import { Settings } from "./types"


export const defaultSettings: Settings = {
  camera: {
    flash: defaultCameraFlash,
    position: defaultCameraPosition,
    ratio: defaultCameraRatio,
  },
  theme: defaultTheme,
}

import { defaultCameraFlash, defaultCameraPosition, defaultCameraRatio } from "./camera"
import { defaultTheme } from "./theme"
import { Settings } from "./types"


export const defaultSettings: Settings = {
  camera: {
    flash: defaultCameraFlash,
    position: defaultCameraPosition,
    ratio: defaultCameraRatio,
  },
  theme: defaultTheme,
}

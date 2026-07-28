import type { Settings } from './settings.types.ts'
import {
  CameraFlash,
  CameraPosition,
  CameraRatio,
  Theme,
} from './settings.types.ts'


export const DEFAULT_SETTINGS: Settings = {
  camera: {
    flash: CameraFlash.OFF,
    position: CameraPosition.BACK,
    ratio: CameraRatio.RATIO_4_3,
  },
  theme: Theme.AUTO,
}

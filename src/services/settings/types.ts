import { ThemeType } from "@theme"
import { CameraFlash, CameraRatio, CameraType } from "./camera"


export interface Settings {
    theme: ThemeType
    camera: {
        flash: CameraFlash
        type: CameraType
        ratio: CameraRatio
    }
}


export interface SettingsContextValue {
    settings: Settings
    setSettings: (settings: Settings) => void
}

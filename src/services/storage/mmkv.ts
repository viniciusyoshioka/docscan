import { MMKV } from "react-native-mmkv"

import { themeDefault } from "../../theme"
import {
    settingsCameraFlashDefault,
    settingsCameraRatioDefault,
    settingsCameraTypeDefault
} from "../settings"
import { AppSettingsKeys } from "./types"


export const storage = new MMKV()


export function setStorageDefaultValues() {
    const allKeys = storage.getAllKeys()
    if (allKeys.length > 0) {
        return
    }

    storage.set(AppSettingsKeys.CAMERA_FLASH, settingsCameraFlashDefault)
    storage.set(AppSettingsKeys.CAMERA_RATIO, settingsCameraRatioDefault)
    storage.set(AppSettingsKeys.CAMERA_TYPE, settingsCameraTypeDefault)
    storage.set(AppSettingsKeys.THEME, themeDefault)
}

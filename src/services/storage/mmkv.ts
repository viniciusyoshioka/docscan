import { MMKV } from "react-native-mmkv"

import { themeDefault } from "../../theme"
import {
    settingsCameraFlashDefault,
    settingsCameraRatioDefault,
    settingsCameraTypeDefault
} from "../settings"
import { AppStorageKeys } from "./types"


export const storage = new MMKV()


export function setStorageDefaultValues() {
    const allKeys = storage.getAllKeys()
    if (allKeys.length > 0) {
        return
    }

    storage.set(AppStorageKeys.CAMERA_FLASH, settingsCameraFlashDefault)
    storage.set(AppStorageKeys.CAMERA_RATIO, settingsCameraRatioDefault)
    storage.set(AppStorageKeys.CAMERA_TYPE, settingsCameraTypeDefault)
    storage.set(AppStorageKeys.THEME, themeDefault)
}

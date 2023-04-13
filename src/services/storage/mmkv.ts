import { MMKV } from "react-native-mmkv"

import { themeDefault } from "../../theme"
import {
    cameraFlashDefault,
    cameraIdDefault,
    cameraRatioDefault,
    cameraTypeDefault,
    cameraWhiteBalanceDefault
} from "../settings"
import { AppSettingsKeys } from "./types"


export const storage = new MMKV()


export function setStorageDefaultValues() {
    const allKeys = storage.getAllKeys()
    if (allKeys.length > 0) {
        return
    }

    storage.set(AppSettingsKeys.CAMERA_FLASH, cameraFlashDefault)
    storage.set(AppSettingsKeys.CAMERA_ID, cameraIdDefault)
    storage.set(AppSettingsKeys.CAMERA_RATIO, cameraRatioDefault)
    storage.set(AppSettingsKeys.CAMERA_TYPE, cameraTypeDefault)
    storage.set(AppSettingsKeys.CAMERA_WHITE_BALANCE, cameraWhiteBalanceDefault)
    storage.set(AppSettingsKeys.THEME, themeDefault)
}

import { MMKV } from "react-native-mmkv"

import { settingsDefault } from "../settings"
import { AppStorageKeys } from "./types"


export const storage = new MMKV()


export function setStorageDefaultValues() {
    const allKeys = storage.getAllKeys()
    if (allKeys.length > 0) {
        return
    }

    storage.set(AppStorageKeys.SETTINGS, JSON.stringify(settingsDefault))
}

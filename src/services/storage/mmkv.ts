import { MMKV } from "react-native-mmkv"

import { settingsDefault } from "../settings"
import { AppStorageKeys } from "./types"


export const storage = new MMKV()


export function setStorageDefaultValues(): boolean {
    const allKeys = storage.getAllKeys()
    if (allKeys.length > 0) return false

    storage.set(AppStorageKeys.SETTINGS, JSON.stringify(settingsDefault))
    return true
}

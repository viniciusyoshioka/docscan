import { MMKV } from "react-native-mmkv"
import { StateStorage } from "zustand/middleware"


const settingsStorage = new MMKV({ id: "settings-storage" })


export const storage: StateStorage = {
  getItem(name) {
    return settingsStorage.getString(name) ?? null
  },
  setItem(name, value) {
    settingsStorage.set(name, value)
  },
  removeItem(name) {
    settingsStorage.delete(name)
  },
}

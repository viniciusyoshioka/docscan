import { MMKV } from "react-native-mmkv"
import { StateStorage } from "zustand/middleware"


export class MMKVStorage implements StateStorage {


  private settingsStorage: MMKV


  constructor(mmkv: MMKV) {
    this.settingsStorage = mmkv
  }


  getItem(name: string): string | null {
    return this.settingsStorage.getString(name) ?? null
  }

  setItem(name: string, value: string) {
    this.settingsStorage.set(name, value)
  }

  removeItem(name: string) {
    this.settingsStorage.delete(name)
  }
}

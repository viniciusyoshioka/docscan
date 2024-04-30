import { MMKV } from "react-native-mmkv"
import { StateStorage } from "zustand/middleware"


export class MMKVStorage implements StateStorage {


  private settingsStorage: MMKV


  constructor(mmkv: MMKV) {
    this.settingsStorage = mmkv
  }


  public getItem(name: string): string | null {
    return this.settingsStorage.getString(name) ?? null
  }

  public setItem(name: string, value: string) {
    this.settingsStorage.set(name, value)
  }

  public removeItem(name: string) {
    this.settingsStorage.delete(name)
  }
}

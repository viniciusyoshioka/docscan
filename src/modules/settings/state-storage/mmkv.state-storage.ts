import type { MMKV } from 'react-native-mmkv'
import type { StateStorage } from 'zustand/middleware'


export class MmkvStateStorage implements StateStorage {


  private readonly storage: MMKV


  constructor(mmkv: MMKV) {
    this.storage = mmkv
  }


  getItem(key: string): string | null {
    return this.storage.getString(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value)
  }

  removeItem(key: string): void {
    this.storage.remove(key)
  }
}

import { merge } from "lodash"
import { MMKV } from "react-native-mmkv"
import { create } from "zustand"
import { StateStorage, createJSONStorage, persist } from "zustand/middleware"

import { MMKVStorage } from "./MMKVStorage"
import { defaultSettings } from "./default"
import { SettingsStore } from "./types"


export function createSettingsHook(stateStorage: StateStorage) {
  return create<SettingsStore>()(persist(
    set => ({
      settings: defaultSettings,
      setSettings: newSettings => {
        set(state => ({
          settings: merge(state.settings, newSettings),
        }))
      },
    }),
    {
      name: "settings-storage",
      version: 1,
      storage: createJSONStorage(() => stateStorage),
    },
  ))
}


const mmkvSettingsStorage = new MMKV({ id: "settings-storage" })
const mmkvStateStorage = new MMKVStorage(mmkvSettingsStorage)
export const useSettings = createSettingsHook(mmkvStateStorage)

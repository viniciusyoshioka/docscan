import { merge } from "lodash"
import { MMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { MMKVStorage } from "./MMKVStorage"
import { defaultSettings } from "./default"
import { SettingsStore } from "./types"


export const useSettings = create<SettingsStore>()(persist(
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
    storage: createJSONStorage(() => {
      const settingsStorage = new MMKV({ id: "settings-storage" })
      return new MMKVStorage(settingsStorage)
    }),
  },
))

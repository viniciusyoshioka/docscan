import { merge } from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { defaultSettings } from "./default"
import { storage } from "./storage"
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
    storage: createJSONStorage(() => storage),
  },
))

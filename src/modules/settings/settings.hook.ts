import { merge } from 'lodash'
import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import type { StateStorage } from 'zustand/middleware'
import { createJSONStorage, persist } from 'zustand/middleware'

import { DEFAULT_SETTINGS } from './settings.constants.ts'
import type { SettingsStore } from './settings.types.ts'
import { MmkvStateStorage } from './state-storage'


function createSettingsHook(stateStorage: StateStorage): () => SettingsStore {
  return create<SettingsStore>()(persist(
    set => ({
      settings: DEFAULT_SETTINGS,
      setSettings: newSettings => {
        set(state => ({
          settings: merge(state.settings, newSettings),
        }))
      },
    }),
    {
      name: 'settings-storage',
      version: 1,
      storage: createJSONStorage(() => stateStorage),
      // TODO: Add migration
    },
  ))
}


const mmkv = createMMKV({ id: 'settings' })
const mmkvStateStorage = new MmkvStateStorage(mmkv)
export const useSettings = createSettingsHook(mmkvStateStorage)

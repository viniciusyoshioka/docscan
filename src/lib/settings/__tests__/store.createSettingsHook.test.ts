import { act, renderHook } from "@testing-library/react-hooks"
import { merge } from "lodash"
import { MMKV } from "react-native-mmkv"
import { PartialDeep } from "type-fest"

import { MMKVStorage } from "../MMKVStorage"
import { defaultSettings } from "../default"
import { createSettingsHook } from "../store"
import { Settings, SettingsStore } from "../types"


describe("createSettingsHook", () => {
  const mmkvSettingsStorage = new MMKV({ id: "test-settings-storage" })
  const mmkvStateStorage = new MMKVStorage(mmkvSettingsStorage)
  let renderedUseSettings: ReturnType<typeof renderHook<unknown, SettingsStore>>

  const spyOnGetItem = jest.spyOn(mmkvStateStorage, "getItem")
  const spyOnSetItem = jest.spyOn(mmkvStateStorage, "setItem")


  afterEach(() => {
    jest.resetAllMocks()
  })


  it("should create useSettings hook with createSettingsHook", () => {
    const useSettings = createSettingsHook(mmkvStateStorage)
    renderedUseSettings = renderHook(() => useSettings())

    expect(renderedUseSettings.result.current).toBeDefined()
    expect(spyOnGetItem).toHaveBeenCalledTimes(1)
  })

  it("should initialize the state with default settings", () => {
    expect(renderedUseSettings.result.current.settings).toEqual(defaultSettings)
    expect(typeof renderedUseSettings.result.current.setSettings).toBe("function")
  })


  describe("Testing the update of theme setting", () => {
    it("should update the theme setting with a new value", () => {
      const newSettings: PartialDeep<Settings> = { theme: "dark" }

      act(() => {
        renderedUseSettings.result.current.setSettings(newSettings)
      })

      const expectedSettings = merge(defaultSettings, newSettings)
      expect(renderedUseSettings.result.current.settings).toEqual(expectedSettings)
      expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    })
  })

  describe("Testing the update of camera setting", () => {
    it("should update the flash setting with a new value", () => {
      const newSettings: PartialDeep<Settings> = { camera: { flash: "on" } }

      act(() => {
        renderedUseSettings.result.current.setSettings(newSettings)
      })

      const expectedSettings = merge(defaultSettings, newSettings)
      expect(renderedUseSettings.result.current.settings).toEqual(expectedSettings)
      expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    })

    it("should update the position setting with a new value", () => {
      const newSettings: PartialDeep<Settings> = { camera: { position: "front" } }

      act(() => {
        renderedUseSettings.result.current.setSettings(newSettings)
      })

      const expectedSettings = merge(defaultSettings, newSettings)
      expect(renderedUseSettings.result.current.settings).toEqual(expectedSettings)
      expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    })

    it("should update the ratio setting with a new value", () => {
      const newSettings: PartialDeep<Settings> = { camera: { ratio: "16:9" } }

      act(() => {
        renderedUseSettings.result.current.setSettings(newSettings)
      })

      const expectedSettings = merge(defaultSettings, newSettings)
      expect(renderedUseSettings.result.current.settings).toEqual(expectedSettings)
      expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    })
  })
})

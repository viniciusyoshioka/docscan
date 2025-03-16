import { act, renderHook, RenderHookResult } from "@testing-library/react-native"
import { merge } from "lodash"
import { MMKV } from "react-native-mmkv"
import { PartialDeep } from "type-fest"

import { MMKVStorage } from "../MMKVStorage"
import { defaultSettings } from "../default"
import { CameraFlash, CameraPosition, CameraRatio, Theme } from "../settings"
import { createSettingsHook } from "../store"
import { Settings, SettingsStore } from "../types"


describe("createSettingsHook", () => {
  const mmkvSettingsStorage = new MMKV({ id: "test-settings-storage" })
  const mmkvStateStorage = new MMKVStorage(mmkvSettingsStorage)
  let renderedUseSettings: RenderHookResult<SettingsStore, never>

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
      const newSettings: PartialDeep<Settings> = { theme: Theme.DARK }

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
      const newSettings: PartialDeep<Settings> = { camera: { flash: CameraFlash.ON } }

      act(() => {
        renderedUseSettings.result.current.setSettings(newSettings)
      })

      const expectedSettings = merge(defaultSettings, newSettings)
      expect(renderedUseSettings.result.current.settings).toEqual(expectedSettings)
      expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    })

    it("should update the position setting with a new value", () => {
      const newSettings: PartialDeep<Settings> = { camera: { position: CameraPosition.FRONT } }

      act(() => {
        renderedUseSettings.result.current.setSettings(newSettings)
      })

      const expectedSettings = merge(defaultSettings, newSettings)
      expect(renderedUseSettings.result.current.settings).toEqual(expectedSettings)
      expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    })

    it("should update the ratio setting with a new value", () => {
      const newSettings: PartialDeep<Settings> = { camera: { ratio: CameraRatio.RATIO_16_9 } }

      act(() => {
        renderedUseSettings.result.current.setSettings(newSettings)
      })

      const expectedSettings = merge(defaultSettings, newSettings)
      expect(renderedUseSettings.result.current.settings).toEqual(expectedSettings)
      expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    })
  })
})

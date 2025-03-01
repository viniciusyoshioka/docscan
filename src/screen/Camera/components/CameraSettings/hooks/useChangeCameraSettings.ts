import { useCallback } from "react"

import { defaultSettings, useSettings } from "@libs/settings"
import { nextCameraPositionSetting, nextFlashSetting, nextRatioSetting } from "../utils"


interface ChangeCameraSettings {
  changeFlash: () => void
  switchCameraPosition: () => void
  changeCameraRatio: () => void
  resetCameraSettings: () => void
}


export function useChangeCameraSettings(): ChangeCameraSettings {


  const { settings, setSettings } = useSettings()


  const changeFlash = useCallback(() => {
    setSettings({
      camera: {
        flash: nextFlashSetting[settings.camera.flash],
      },
    })
  }, [settings.camera.flash])

  const switchCameraPosition = useCallback(() => {
    setSettings({
      camera: {
        position: nextCameraPositionSetting[settings.camera.position],
      },
    })
  }, [settings.camera.position])

  const changeCameraRatio = useCallback(() => {
    setSettings({
      camera: {
        ratio: nextRatioSetting[settings.camera.ratio],
      },
    })
  }, [settings.camera.ratio])

  const resetCameraSettings = useCallback(() => {
    setSettings({
      camera: defaultSettings.camera,
    })
  }, [])


  return {
    changeFlash,
    switchCameraPosition,
    changeCameraRatio,
    resetCameraSettings,
  }
}

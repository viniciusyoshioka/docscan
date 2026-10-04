import { useCallback } from 'react'

import { DEFAULT_SETTINGS, useSettings } from '@modules/settings'
import {
  nextCameraPositionSetting,
  nextFlashSetting,
  nextRatioSetting,
} from '../utils'


interface ChangeCameraSettings {
  changeFlash: () => void
  switchCameraPosition: () => void
  changeCameraRatio: () => void
  resetCameraSettings: () => void
}


// TODO: Check if the new setting value is supported by device. May need to
// change the setting directly instead of mapping one value to the following.
// Changing this implies refactoring the CameraSettings modal.
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
      camera: DEFAULT_SETTINGS.camera,
    })
  }, [])


  return {
    changeFlash,
    switchCameraPosition,
    changeCameraRatio,
    resetCameraSettings,
  }
}

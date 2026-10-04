import { useMemo } from 'react'
import type { ScaledSize } from 'react-native'
import { useWindowDimensions } from 'react-native'

import type { CameraRatio } from '@modules/settings'
import { useSettings } from '@modules/settings'
import { CAMERA_RATIO_TO_RATIO_NUMBER } from '../camera.constants.ts'


interface CameraViewSizeParams {
  windowSize?: Pick<ScaledSize, 'width' | 'height'>
  cameraRatio?: CameraRatio
}


interface CameraViewSize {
  width: number
  height: number
}


export function useCameraViewSize(
  params?: CameraViewSizeParams,
): CameraViewSize {
  const { windowSize, cameraRatio } = params ?? {}


  const window = useWindowDimensions()

  const { settings } = useSettings()


  const windowSizeToUse = useMemo(() => {
    if (windowSize) return windowSize
    return {
      width: window.width,
      height: window.height,
    }
  }, [windowSize, window])

  const cameraRatioToUse = useMemo(() => {
    if (cameraRatio) return cameraRatio
    return settings.camera.ratio
  }, [cameraRatio, settings.camera.ratio])


  const cameraViewSize = useMemo<CameraViewSize>(() => {
    const ratio = CAMERA_RATIO_TO_RATIO_NUMBER[cameraRatioToUse]

    let cameraWidth = windowSizeToUse.width
    let cameraHeight = windowSizeToUse.width * ratio
    if (cameraHeight > windowSizeToUse.height) {
      cameraHeight = windowSizeToUse.height
      cameraWidth = windowSizeToUse.height / ratio
    }

    return {
      width: cameraWidth,
      height: cameraHeight,
    }
  }, [cameraRatioToUse, windowSizeToUse])


  return cameraViewSize
}

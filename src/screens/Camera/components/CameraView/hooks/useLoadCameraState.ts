import { useEffect, useRef } from 'react'
import { useCameraDevice } from 'react-native-vision-camera'

import type { CameraRatio } from '@modules/settings'
import { RATIO_NUMBER_TO_CAMERA_RATIO } from '../../../camera.constants.ts'
import type { CameraState } from '../../../hooks'


interface LoadCameraStateParams {
  onCameraStateLoaded?: (cameraState: CameraState) => void
}


export function useLoadCameraState(params: LoadCameraStateParams) {
  const { onCameraStateLoaded } = params


  const hasLoadedRef = useRef(false)
  const backCameraDevice = useCameraDevice('back')
  const frontCameraDevice = useCameraDevice('front')


  function loadBackCameraDeviceState() {
    if (!backCameraDevice) {
      return {
        hasDevice: false,
        supportsFlash: false,
        supportedRatios: new Set<CameraRatio>(),
      }
    }

    const supportedCameraRatios = backCameraDevice
      .getSupportedResolutions('photo')
      .map(resolution => {
        const ratioNumber = resolution.width / resolution.height
        return RATIO_NUMBER_TO_CAMERA_RATIO[ratioNumber]
      })
      .filter(cameraRatio => !!cameraRatio)

    return {
      hasDevice: true,
      supportsFlash: backCameraDevice.hasFlash,
      supportedRatios: new Set<CameraRatio>(supportedCameraRatios),
    }
  }

  function loadFrontCameraDeviceState() {
    if (!frontCameraDevice) {
      return {
        hasDevice: false,
        supportsFlash: false,
        supportedRatios: new Set<CameraRatio>(),
      }
    }

    const supportedCameraRatios = frontCameraDevice
      .getSupportedResolutions('photo')
      .map(resolution => {
        const ratioNumber = resolution.width / resolution.height
        return RATIO_NUMBER_TO_CAMERA_RATIO[ratioNumber]
      })
      .filter(cameraRatio => !!cameraRatio)

    return {
      hasDevice: true,
      supportsFlash: frontCameraDevice.hasFlash,
      supportedRatios: new Set<CameraRatio>(supportedCameraRatios),
    }
  }


  function loadCameraState() {
    if (hasLoadedRef.current) return
    if (!backCameraDevice && !frontCameraDevice) return

    const backDeviceState = loadBackCameraDeviceState()
    const frontDeviceState = loadFrontCameraDeviceState()

    onCameraStateLoaded?.({
      backDevice: backDeviceState,
      frontDevice: frontDeviceState,
    })

    hasLoadedRef.current = true
  }


  useEffect(() => {
    loadCameraState()
  }, [backCameraDevice, frontCameraDevice])
}

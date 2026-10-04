import type { CameraDevice, FlashMode } from 'react-native-vision-camera'

import { CameraFlash, useSettings } from '@modules/settings'


const CAMERA_FLASH_MAP: Record<CameraFlash, FlashMode> = {
  [CameraFlash.AUTO]: 'auto',
  [CameraFlash.OFF]: 'off',
  [CameraFlash.ON]: 'on',
}


export function useMapCameraFlash(
  cameraDevice: CameraDevice | undefined,
): FlashMode {


  const { settings } = useSettings()


  const mappedCameraFlash = CAMERA_FLASH_MAP[settings.camera.flash]

  const doesCameraDeviceSupportsFlash = cameraDevice && cameraDevice.hasFlash
  if (!doesCameraDeviceSupportsFlash) {
    return 'off'
  }

  return mappedCameraFlash
}

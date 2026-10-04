import { CameraPosition, useSettings } from '@modules/settings'
import type { CameraState } from '../../../hooks'


interface IsFlashSupportedParams {
  cameraState: CameraState
}


export function useIsFlashSupported(params: IsFlashSupportedParams): boolean {
  const { cameraState } = params


  const { settings } = useSettings()


  const deviceState = settings.camera.position === CameraPosition.BACK
    ? cameraState.backDevice
    : cameraState.frontDevice

  const isFlashSupported = deviceState.hasDevice && deviceState.supportsFlash


  return isFlashSupported
}

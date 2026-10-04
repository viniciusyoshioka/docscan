import { CameraPosition, useSettings } from '@modules/settings'
import type { CameraState } from '../../../hooks'


interface IsRatioSupportedParams {
  cameraState: CameraState
}


export function useIsRatioSupported(params: IsRatioSupportedParams): boolean {
  const { cameraState } = params


  const { settings } = useSettings()


  const deviceState = settings.camera.position === CameraPosition.BACK
    ? cameraState.backDevice
    : cameraState.frontDevice

  const isRatioSupported = deviceState.supportedRatios.size > 1


  return isRatioSupported
}

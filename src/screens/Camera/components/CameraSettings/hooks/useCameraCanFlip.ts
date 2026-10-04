import type { CameraState } from '../../../hooks'


interface CameraCanFlipParams {
  cameraState: CameraState
}


export function useCameraCanFlip(params: CameraCanFlipParams): boolean {
  const { cameraState } = params


  const cameraCanFlip = (
    cameraState.backDevice.hasDevice
    && cameraState.frontDevice.hasDevice
  )


  return cameraCanFlip
}

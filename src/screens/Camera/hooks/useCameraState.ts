import { useCallback, useMemo, useState } from 'react'

import type { CameraRatio } from '@modules/settings'


export interface CameraDeviceState {
  hasDevice: boolean
  supportsFlash: boolean
  supportedRatios: Set<CameraRatio>
}

export interface CameraState {
  backDevice: CameraDeviceState
  frontDevice: CameraDeviceState
}

interface CameraStateResult {
  cameraState: CameraState
  onCameraStateLoaded: (newCameraState: CameraState) => void
}


const DEFAULT_CAMERA_STATE: CameraState = {
  backDevice: {
    hasDevice: false,
    supportsFlash: false,
    supportedRatios: new Set(),
  },
  frontDevice: {
    hasDevice: false,
    supportsFlash: false,
    supportedRatios: new Set(),
  },
}


// TODO: After loading the camera state, if some default camera setting is not
// supported, it must be automatically updated to a supported config if some
// is available. Otherwise, keep the default setting, as it will not be used
// due to no available option from that config
export function useCameraState(): CameraStateResult {


  const [cameraState, setCameraState] = useState(DEFAULT_CAMERA_STATE)


  const onCameraStateLoaded = useCallback(
    (newCameraState: CameraState) => {
      setCameraState(newCameraState)
    },
    [],
  )


  const cameraStateResult = useMemo<CameraStateResult>(() => ({
    cameraState,
    onCameraStateLoaded,
  }), [cameraState, onCameraStateLoaded])


  return cameraStateResult
}

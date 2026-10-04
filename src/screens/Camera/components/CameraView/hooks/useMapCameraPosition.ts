import type { TargetCameraPosition } from 'react-native-vision-camera'

import { CameraPosition, useSettings } from '@modules/settings'


const CAMERA_POSITION_MAP: Record<CameraPosition, TargetCameraPosition> = {
  [CameraPosition.BACK]: 'back',
  [CameraPosition.FRONT]: 'front',
}


export function useMapCameraPosition(): TargetCameraPosition {


  const { settings } = useSettings()


  return CAMERA_POSITION_MAP[settings.camera.position]
}

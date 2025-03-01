import { useIsFocused } from "@react-navigation/native"
import { CameraDevice } from "react-native-vision-camera"

import { useIsForeground } from "@hooks"


type IsShowingCameraParams = {
  hasCameraPermission: boolean
  cameraDevice: CameraDevice | undefined
}


export function useIsShowingCamera(params: IsShowingCameraParams): boolean {
  const { hasCameraPermission, cameraDevice } = params


  const isFocused = useIsFocused()
  const isForeground = useIsForeground()


  return hasCameraPermission && !!cameraDevice && isFocused && isForeground
}

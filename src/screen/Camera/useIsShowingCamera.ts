import { CameraDevice } from "react-native-vision-camera"


export type ShowingCameraOptions = {
  hasCameraPermission: boolean
  cameraDevice: CameraDevice | undefined
}


export function useIsShowingCamera(options: ShowingCameraOptions): boolean {

  const { hasCameraPermission, cameraDevice } = options

  return hasCameraPermission && !!cameraDevice
}

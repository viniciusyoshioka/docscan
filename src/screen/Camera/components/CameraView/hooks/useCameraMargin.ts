import { useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { CAMERA_HEADER_HEIGHT } from "../../CameraHeader"
import { useCameraSize } from "./useCameraSize"


type CameraMargin = {
  top: number
}


// TODO: Check if isShowingCamera is necessary
export function useCameraMargin(isShowingCamera: boolean): CameraMargin {


  const safeAreaInsets = useSafeAreaInsets()
  const { height } = useWindowDimensions()

  const defaultCameraSize = useCameraSize()


  const topSafeAreaInset = isShowingCamera ? 0 : safeAreaInsets.top

  if ((defaultCameraSize.height + CAMERA_HEADER_HEIGHT + safeAreaInsets.top) < height) {
    return { top: CAMERA_HEADER_HEIGHT + topSafeAreaInset }
  }
  return { top: 0 }
}

import { useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useSettings } from "@lib/settings"
import { HEADER_HEIGHT } from "./Header"
import { getCameraSize } from "./utils"


export type CameraMarginOptions = {
  isShowingCamera: boolean
}


export type CameraMargin = {
  top: number
}


export function useCameraMargin(options: CameraMarginOptions): CameraMargin {


  const { isShowingCamera } = options


  const safeAreaInsets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const { settings } = useSettings()


  const topSafeAreaInset = isShowingCamera ? 0 : safeAreaInsets.top

  const defaultCameraSize = getCameraSize({ width, height }, settings.camera.ratio)
  if ((defaultCameraSize.height + HEADER_HEIGHT + safeAreaInsets.top) < height) {
    return { top: HEADER_HEIGHT + topSafeAreaInset }
  }
  return { top: 0 }
}

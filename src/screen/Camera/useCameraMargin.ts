import { useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useSettings } from "@services/settings"
import { HEADER_HEIGHT } from "./Header"
import { getCameraSize } from "./utils"


export type CameraMargin = {
    top: number
}


export function useCameraMargin(): CameraMargin {


    const safeAreaInsets = useSafeAreaInsets()
    const { width, height } = useWindowDimensions()

    const { settings } = useSettings()


    const defaultCameraSize = getCameraSize({ width, height }, settings.camera.ratio)
    if ((defaultCameraSize.height + HEADER_HEIGHT + safeAreaInsets.top) < height) {
        return { top: HEADER_HEIGHT + safeAreaInsets.top }
    }
    return { top: 0 }
}

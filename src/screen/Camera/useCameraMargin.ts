import { useWindowDimensions } from "react-native"

import { HEADER_HEIGHT } from "../../components"
import { useSettings } from "../../services/settings"
import { getCameraSize } from "./utils"


export type CameraMargin = {
    top: number;
}


export function useCameraMargin(): CameraMargin {


    const { width, height } = useWindowDimensions()
    const { settings } = useSettings()


    const defaultCameraSize = getCameraSize({ width, height }, settings.camera.ratio)
    if ((defaultCameraSize.height + HEADER_HEIGHT) < height) {
        return { top: HEADER_HEIGHT }
    }
    return { top: 0 }
}

import { useWindowDimensions } from "react-native"

import { HEADER_HEIGHT } from "../../components"
import { getCameraSize } from "./utils"


export type CameraMargin = {
    top: number;
}


export function useCameraMargin(): CameraMargin {


    const { width, height } = useWindowDimensions()


    const defaultCameraSize = getCameraSize({ width, height }, "3:4")
    if (!defaultCameraSize) return { top: 0 }

    if ((defaultCameraSize.height + HEADER_HEIGHT) < height) {
        return { top: HEADER_HEIGHT }
    }
    return { top: 0 }
}

import { Dimensions, StatusBar, ViewStyle, useWindowDimensions } from "react-native"

import { HEADER_HEIGHT } from "../Header"
import { getCameraSize } from "../utils"
import { ACTION_SIZE } from "./Action"
import { MAIN_ACTION_SIZE } from "./MainAction"


export type CameraControlDimensions = {
    size: CameraControlSize
    styleWithCamera: ViewStyle
    styleWithouCamera: ViewStyle
    shouldUseWithoutCameraStyle: boolean
}

export type CameraControlSize = {
    PADDING_VERTICAL_WITHOUT_CAMERA: number
    PADDING_VERTICAL_WITH_CAMERA: number
    HEIGHT_WITHOUT_CAMERA: number
    HEIGHT_WITH_CAMERA: number
}


export function useCameraControlDimensions(): CameraControlDimensions {


    const { height } = useWindowDimensions()


    const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0
    const SCREEN_DIMENSIONS = Dimensions.get("screen")
    const SCREEN_WIDTH = SCREEN_DIMENSIONS.width
    const SCREEN_HEIGHT = SCREEN_DIMENSIONS.height - STATUS_BAR_HEIGHT
    const DEFAULT_CAMERA_SIZE = getCameraSize({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, "4:3")


    const PADDING_VERTICAL_WITHOUT_CAMERA = 16
    const PADDING_VERTICAL_WITH_CAMERA = 32

    const HEIGHT_WITHOUT_CAMERA = Math.max(
        MAIN_ACTION_SIZE + (2 * PADDING_VERTICAL_WITHOUT_CAMERA),
        ACTION_SIZE + (2 * PADDING_VERTICAL_WITHOUT_CAMERA)
    )
    const HEIGHT_WITH_CAMERA = Math.max(
        MAIN_ACTION_SIZE + (2 * PADDING_VERTICAL_WITH_CAMERA),
        ACTION_SIZE + (2 * PADDING_VERTICAL_WITH_CAMERA),
        SCREEN_HEIGHT - HEADER_HEIGHT - DEFAULT_CAMERA_SIZE.height
    )


    const size: CameraControlSize = {
        PADDING_VERTICAL_WITHOUT_CAMERA,
        PADDING_VERTICAL_WITH_CAMERA,
        HEIGHT_WITHOUT_CAMERA,
        HEIGHT_WITH_CAMERA,
    }

    const styleWithouCamera: ViewStyle = {
        paddingVertical: PADDING_VERTICAL_WITHOUT_CAMERA,
        minHeight: undefined,
        maxHeight: HEIGHT_WITHOUT_CAMERA,
    }

    const styleWithCamera: ViewStyle = {
        paddingVertical: PADDING_VERTICAL_WITH_CAMERA,
        minHeight: HEIGHT_WITH_CAMERA,
        maxHeight: undefined,
    }

    const shouldUseWithoutCameraStyle = (HEIGHT_WITH_CAMERA >= (height / 2))


    return { size, styleWithouCamera, styleWithCamera, shouldUseWithoutCameraStyle }
}

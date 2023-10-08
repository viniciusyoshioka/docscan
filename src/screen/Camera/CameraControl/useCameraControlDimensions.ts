import { Dimensions, StatusBar, useWindowDimensions } from "react-native"

import { HEADER_HEIGHT, getCameraSize } from "../utils"
import { CONTROL_ACTION_SIZE } from "./ControlAction"
import { CONTROL_BUTTON_HEIGHT } from "./ControlButton"


const SCREEN_DIMENSIONS = Dimensions.get("screen")
const SCREEN_WIDTH = SCREEN_DIMENSIONS.width
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.height - (StatusBar.currentHeight ?? 0)


const DEFAULT_CAMERA_SIZE = getCameraSize({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, "3:4")


export type CameraControlDimensions = {
    size: CameraControlSize;
    styleWithCamera: CameraControlStyle;
    styleWithouCamera: CameraControlStyle;
    shouldUseWithoutCameraStyle: boolean;
}

export type CameraControlSize = {
    PADDING_VERTICAL_WITHOUT_CAMERA: number;
    PADDING_VERTICAL_WITH_CAMERA: number;
    HEIGHT_WITHOUT_CAMERA: number;
    HEIGHT_WITH_CAMERA: number;
}

export type CameraControlStyle = {
    paddingVertical?: number;
    minHeight?: number;
    maxHeight?: number;
}


export function useCameraControlDimensions(): CameraControlDimensions {


    const { height } = useWindowDimensions()


    const PADDING_VERTICAL_WITHOUT_CAMERA = 16
    const PADDING_VERTICAL_WITH_CAMERA = 32

    const HEIGHT_WITHOUT_CAMERA = Math.max(
        CONTROL_ACTION_SIZE + (2 * PADDING_VERTICAL_WITHOUT_CAMERA),
        CONTROL_BUTTON_HEIGHT + (2 * PADDING_VERTICAL_WITHOUT_CAMERA)
    )
    const HEIGHT_WITH_CAMERA = Math.max(
        SCREEN_HEIGHT - HEADER_HEIGHT - DEFAULT_CAMERA_SIZE.height,
        CONTROL_ACTION_SIZE + (2 * PADDING_VERTICAL_WITH_CAMERA),
        CONTROL_BUTTON_HEIGHT + (2 * PADDING_VERTICAL_WITH_CAMERA)
    )


    const size: CameraControlSize = {
        PADDING_VERTICAL_WITHOUT_CAMERA,
        PADDING_VERTICAL_WITH_CAMERA,
        HEIGHT_WITHOUT_CAMERA,
        HEIGHT_WITH_CAMERA,
    }

    const styleWithouCamera: CameraControlStyle = {
        paddingVertical: PADDING_VERTICAL_WITHOUT_CAMERA,
        minHeight: undefined,
        maxHeight: HEIGHT_WITHOUT_CAMERA,
    }

    const styleWithCamera: CameraControlStyle = {
        paddingVertical: PADDING_VERTICAL_WITH_CAMERA,
        minHeight: HEIGHT_WITH_CAMERA,
        maxHeight: undefined,
    }

    const shouldUseWithoutCameraStyle = (HEIGHT_WITH_CAMERA >= (height / 2))


    return { size, styleWithouCamera, styleWithCamera, shouldUseWithoutCameraStyle }
}

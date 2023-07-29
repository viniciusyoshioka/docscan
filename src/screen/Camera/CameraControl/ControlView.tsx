import { useMemo } from "react"
import { Dimensions, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native"

import { HEADER_HEIGHT } from "../../../components"
import { getCameraSize } from "../utils"
import { CONTROL_ACTION_SIZE } from "./ControlAction"


const { width, height } = Dimensions.get("window")
const cameraSize = getCameraSize({ width, height }, "3:4")


export const CONTROL_VIEW_PADDING_VERTICAL_WITH_CAMERA = 32
export const CONTROL_VIEW_PADDING_VERTICAL_WITHOUT_CAMERA = 16

export const CONTROL_VIEW_MIN_HEIGHT = cameraSize
    ? height - HEADER_HEIGHT - cameraSize.height
    : 2 * CONTROL_VIEW_PADDING_VERTICAL_WITHOUT_CAMERA

export const CONTROL_VIEW_MAX_HEIGHT_WITHOUT_CAMERA = (
    (2 * CONTROL_VIEW_PADDING_VERTICAL_WITHOUT_CAMERA) + CONTROL_ACTION_SIZE
)


export interface ControlViewProps extends ViewProps {
    isShowingCamera: boolean;
}


export function ControlView(props: ControlViewProps) {


    const wrapperStyle = useMemo((): StyleProp<ViewStyle> => {
        const newWrapperStyle: ViewStyle = {
            minHeight: undefined,
            maxHeight: CONTROL_VIEW_MAX_HEIGHT_WITHOUT_CAMERA,
            paddingVertical: CONTROL_VIEW_PADDING_VERTICAL_WITHOUT_CAMERA,
            backgroundColor: "transparent",
        }

        if (props.isShowingCamera) {
            newWrapperStyle.minHeight = CONTROL_VIEW_MIN_HEIGHT
            newWrapperStyle.maxHeight = undefined
            newWrapperStyle.paddingVertical = CONTROL_VIEW_PADDING_VERTICAL_WITH_CAMERA
            newWrapperStyle.backgroundColor = "rgba(0, 0, 0, 0.4)"
        }

        return StyleSheet.flatten([styles.wrapper, newWrapperStyle, props.style])
    }, [props.isShowingCamera, props.style])


    return (
        <View style={wrapperStyle}>
            <View style={styles.container} children={props.children} />
        </View>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        zIndex: 1,
    },
    container: {
        justifyContent: "space-around",
        flexDirection: "row",
    },
})

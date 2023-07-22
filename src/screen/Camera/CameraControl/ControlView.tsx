import { useMemo } from "react"
import { Dimensions, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native"

import { HEADER_HEIGHT } from "../../../components"
import { getCameraSize } from "../utils"
import { CONTROL_ACTION_SIZE } from "./ControlAction"


const { width, height } = Dimensions.get("window")
const cameraSize = getCameraSize({ width, height }, "3:4")


export const CONTROL_VIEW_PADDING_VERTICAL = 32
export const CONTROL_VIEW_MIN_HEIGHT = cameraSize
    ? height - HEADER_HEIGHT - cameraSize.height
    : 2 * CONTROL_VIEW_PADDING_VERTICAL
export const CONTROL_VIEW_MAX_HEIGHT_WITHOUT_CAMERA = (2 * CONTROL_VIEW_PADDING_VERTICAL) + CONTROL_ACTION_SIZE


export interface ControlViewProps extends ViewProps {
    isShowingCamera: boolean;
}


export function ControlView(props: ControlViewProps) {


    const wrapperStyle = useMemo((): StyleProp<ViewStyle> => {
        const newWrapperStyle: ViewStyle = {
            minHeight: props.isShowingCamera ? CONTROL_VIEW_MIN_HEIGHT : undefined,
            maxHeight: !props.isShowingCamera ? CONTROL_VIEW_MAX_HEIGHT_WITHOUT_CAMERA : undefined,
            backgroundColor: props.isShowingCamera ? "rgba(0, 0, 0, 0.4)" : "transparent",
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
        minHeight: CONTROL_VIEW_MIN_HEIGHT,
        paddingVertical: CONTROL_VIEW_PADDING_VERTICAL,
        zIndex: 1,
    },
    container: {
        justifyContent: "space-around",
        flexDirection: "row",
    },
})

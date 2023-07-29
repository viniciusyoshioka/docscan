import { StyleSheet, View, ViewProps } from "react-native"

import { useCameraControlDimensions } from "./useCameraControlDimensions"


export interface ControlViewProps extends ViewProps {
    isShowingCamera: boolean;
}


export function ControlView(props: ControlViewProps) {


    const cameraControlDimensions = useCameraControlDimensions()
    const { styleWithCamera, styleWithouCamera, shouldUseWithoutCameraStyle } = cameraControlDimensions

    const cameraControlStyle = shouldUseWithoutCameraStyle
        ? styleWithouCamera
        : props.isShowingCamera
            ? styleWithCamera
            : styleWithouCamera

    const wrapperStyle = StyleSheet.flatten([styles.wrapper, {
        backgroundColor: props.isShowingCamera ? "rgba(0, 0, 0, 0.4)" : "transparent",
        ...cameraControlStyle,
    }, props.style])


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

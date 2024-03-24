import { ReactNode } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import { useCameraControlDimensions } from "./useCameraControlDimensions"


export interface ActionBarProps {
  isShowingCamera: boolean
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}


export function ActionBar(props: ActionBarProps) {


  const cameraControlDimensions = useCameraControlDimensions()
  const {
    styleWithCamera,
    styleWithouCamera,
    shouldUseWithoutCameraStyle,
  } = cameraControlDimensions


  const actionBarStyle: ViewStyle = shouldUseWithoutCameraStyle
    ? styleWithouCamera
    : props.isShowingCamera
      ? styleWithCamera
      : styleWithouCamera
  const actionBarBackgroundStyle: ViewStyle = {
    backgroundColor: props.isShowingCamera ? "rgba(0, 0, 0, 0.4)" : "transparent",
  }
  const wrapperStyle: ViewStyle = StyleSheet.flatten([
    styles.wrapper,
    actionBarBackgroundStyle,
    actionBarStyle,
    props.style,
  ])


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

import { PropsWithChildren } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"

import { useCameraControlStyle } from "../../hooks"
import { styles } from "./styles"


interface ActionBarProps extends PropsWithChildren {
  isShowingCamera: boolean
}


export function ActionBar(props: ActionBarProps) {


  const cameraControlStyle = useCameraControlStyle(props.isShowingCamera)


  const actionBarBackgroundStyle: ViewStyle = {
    backgroundColor: props.isShowingCamera ? "rgba(0, 0, 0, 0.4)" : "transparent",
  }

  const wrapperStyle: ViewStyle = StyleSheet.flatten([
    styles.wrapper,
    actionBarBackgroundStyle,
    cameraControlStyle.style,
  ])


  return <View style={wrapperStyle} children={props.children} />
}

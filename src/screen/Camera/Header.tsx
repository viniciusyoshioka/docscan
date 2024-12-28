import { StyleSheet } from "react-native"
import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppTheme } from "@theme"


export const HEADER_HEIGHT = 64


export interface CameraHeaderProps {
  goBack: () => void
  openSettings: () => void
  isShowingCamera: boolean
}


export function CameraHeader(props: CameraHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()

  const { isDark } = useAppTheme()

  const headerAbsoulteStyle = { ...styles.absolute, top: safeAreaInsets.top }
  const headerCameraBasedStyle = props.isShowingCamera
    ? styles.headerWithCamera
    : styles.headerWithoutCamera
  const headerStyle = { ...headerCameraBasedStyle, ...headerAbsoulteStyle }
  const iconColor = (props.isShowingCamera || isDark) ? "white" : "black"


  return (
    <Appbar.Header style={headerStyle}>
      <Appbar.BackAction
        iconColor={iconColor}
        onPress={props.goBack}
      />

      <Appbar.Content title={""} />

      <Appbar.Action
        icon={"cog"}
        iconColor={iconColor}
        onPress={props.openSettings}
        disabled={!props.isShowingCamera}
      />
    </Appbar.Header>
  )
}


const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerWithCamera: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  headerWithoutCamera: {
    backgroundColor: "transparent",
  },
})

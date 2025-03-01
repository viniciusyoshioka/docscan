import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppTheme } from "@theme"
import { styles } from "./styles"


export * from "./constants"


interface CameraHeaderProps {
  goBack: () => void
  openCameraSettings: () => void
  isShowingCamera: boolean
}


export function CameraHeader(props: CameraHeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()

  const { isDark } = useAppTheme()


  const headerCameraBasedStyle = props.isShowingCamera
    ? styles.headerWithCamera
    : styles.headerWithoutCamera

  const headerStyle = {
    ...headerCameraBasedStyle,
    ...styles.absolute,
    top: safeAreaInsets.top,
  }

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
        onPress={props.openCameraSettings}
        disabled={!props.isShowingCamera}
      />
    </Appbar.Header>
  )
}

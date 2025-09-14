import { PropsWithChildren } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { useStyles } from "react-native-unistyles"

import { useCameraControlStyle } from "../../../CameraControl"
import { stylesheet } from "./styles"


export interface SettingsModalProps extends PropsWithChildren {
  isVisible: boolean
  onRequestClose: () => void
  isShowingCamera: boolean
}


export function SettingsModal(props: SettingsModalProps) {


  const { styles } = useStyles(stylesheet)

  const cameraControlStyle = useCameraControlStyle(props.isShowingCamera)


  if (!props.isVisible) {
    return null
  }


  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={props.onRequestClose}
      style={styles.scrim}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.container,
          { marginBottom: cameraControlStyle.height },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.content}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.contentWrapper}
            children={props.children}
          />
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

import { Linking, ScrollView, View, ViewStyle, useWindowDimensions } from "react-native"
import { Button, Text } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { translate } from "@locales"
import { useCameraControlStyle } from "../../../CameraControl"
import { CAMERA_HEADER_HEIGHT } from "../../../Header"
import { stylesheet } from "./styles"


interface NoPermissionMessageProps {
  requestCameraPermission: () => Promise<void>
}


export function NoPermissionMessage(props: NoPermissionMessageProps) {


  const { height } = useWindowDimensions()
  const { styles } = useStyles(stylesheet)

  const cameraControlStyle = useCameraControlStyle(false)


  const scrollScreenStyle: ViewStyle = {
    marginTop: CAMERA_HEADER_HEIGHT,
    marginBottom: cameraControlStyle.height,
  }

  const scrollScreenContentContainerStyle: ViewStyle = {
    minHeight: height - CAMERA_HEADER_HEIGHT - cameraControlStyle.height,
  }


  return (
    <ScrollView
      style={scrollScreenStyle}
      contentContainerStyle={scrollScreenContentContainerStyle}
    >
      <View style={styles.textContainer}>
        <Text variant={"titleLarge"} style={styles.messageTitle}>
          {translate("Camera_noPermission")}
        </Text>

        <Text variant={"bodyLarge"} style={styles.messageText}>
          &bull; {translate("Camera_allowCameraWithGrantPermission")}
        </Text>

        <Text variant={"bodyLarge"} style={styles.messageText}>
          &bull; {translate("Camera_allowCameraThroughSettings")}
        </Text>

        <Text variant={"bodyLarge"} style={styles.messageText}>
          &bull; {translate("Camera_enableCamera")}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode={"outlined"}
          children={translate("Camera_openSettings")}
          onPress={Linking.openSettings}
          style={{ width: "100%" }}
        />

        <Button
          mode={"contained"}
          children={translate("Camera_grantPermission")}
          onPress={props.requestCameraPermission}
          style={{ width: "100%" }}
        />
      </View>
    </ScrollView>
  )
}

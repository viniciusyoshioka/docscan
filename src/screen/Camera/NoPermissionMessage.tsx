import { ScrollScreen } from "@elementium/native"
import { Linking, View, ViewStyle, useWindowDimensions } from "react-native"
import { Button, Text } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { translate } from "@locales"
import { useCameraControlDimensions } from "./CameraControl"
import { HEADER_HEIGHT } from "./Header"
import { stylesheet } from "./style"


export interface NoPermissionMessageProps {
    hasCameraPermission: boolean
    requestCameraPermission: () => Promise<void>
}


export function NoPermissionMessage(props: NoPermissionMessageProps) {


    const { height } = useWindowDimensions()
    const { styles } = useStyles(stylesheet)

    const { size: cameraControlSize } = useCameraControlDimensions()

    const scrollScreenStyle: ViewStyle = {
        marginTop: HEADER_HEIGHT,
        marginBottom: cameraControlSize.HEIGHT_WITHOUT_CAMERA,
    }
    const scrollScreenContentContainerStyle: ViewStyle = {
        minHeight: height - HEADER_HEIGHT - cameraControlSize.HEIGHT_WITHOUT_CAMERA,
    }


    if (props.hasCameraPermission) return null


    return (
        <ScrollScreen
            style={scrollScreenStyle}
            contentContainerStyle={scrollScreenContentContainerStyle}
        >
            <View style={styles.cameraTextWrapper}>
                <Text variant={"titleLarge"} style={styles.cameraMessageTitle}>
                    {translate("Camera_noPermission")}
                </Text>

                <Text variant={"bodyLarge"} style={styles.cameraMessageText}>
                    &bull; {translate("Camera_allowCameraWithGrantPermission")}
                </Text>

                <Text variant={"bodyLarge"} style={styles.cameraMessageText}>
                    &bull; {translate("Camera_allowCameraThroughSettings")}
                </Text>

                <Text variant={"bodyLarge"} style={styles.cameraMessageText}>
                    &bull; {translate("Camera_enableCamera")}
                </Text>
            </View>

            <View style={styles.cameraButtonWrapper}>
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
        </ScrollScreen>
    )
}

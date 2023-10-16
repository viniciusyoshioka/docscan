import { ScrollScreen } from "@elementium/native"
import { Linking, ViewStyle, useWindowDimensions } from "react-native"
import { Button } from "react-native-paper"

import { translate } from "@locales"
import { useCameraControlDimensions } from "./CameraControl"
import { HEADER_HEIGHT } from "./Header"
import { CameraButtonWrapper, CameraMessageText, CameraMessageTitle, CameraTextWrapper } from "./style"


export interface NoPermissionMessageProps {
    hasCameraPermission: boolean
    requestCameraPermission: () => Promise<void>
}


export function NoPermissionMessage(props: NoPermissionMessageProps) {


    const { height } = useWindowDimensions()

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
            <CameraTextWrapper>
                <CameraMessageTitle variant={"titleLarge"}>
                    {translate("Camera_noPermission")}
                </CameraMessageTitle>

                <CameraMessageText variant={"bodyLarge"}>
                    &bull; {translate("Camera_allowCameraWithGrantPermission")}
                </CameraMessageText>

                <CameraMessageText variant={"bodyLarge"}>
                    &bull; {translate("Camera_allowCameraThroughSettings")}
                </CameraMessageText>

                <CameraMessageText variant={"bodyLarge"}>
                    &bull; {translate("Camera_enableCamera")}
                </CameraMessageText>
            </CameraTextWrapper>

            <CameraButtonWrapper>
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
            </CameraButtonWrapper>
        </ScrollScreen>
    )
}

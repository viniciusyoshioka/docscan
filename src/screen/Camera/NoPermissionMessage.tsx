import { Button, ScrollScreen } from "@elementium/native"
import { Linking, ViewStyle, useWindowDimensions } from "react-native"

import { HEADER_HEIGHT } from "../../components"
import { translate } from "../../locales"
import { CAMERA_CONTROL_HEIGHT_WITHOUT_CAMERA } from "./CameraControl"
import { CameraButtonWrapper, CameraMessageText, CameraMessageTitle, CameraTextWrapper } from "./style"


export interface NoPermissionMessageProps {
    isVisible: boolean;
    requestCameraPermission: () => void;
}


export function NoPermissionMessage(props: NoPermissionMessageProps) {


    const { height } = useWindowDimensions()

    const scrollScreenStyle: ViewStyle = {
        marginTop: HEADER_HEIGHT,
        marginBottom: CAMERA_CONTROL_HEIGHT_WITHOUT_CAMERA,
    }
    const scrollScreenContentContainerStyle: ViewStyle = {
        minHeight: height - HEADER_HEIGHT - CAMERA_CONTROL_HEIGHT_WITHOUT_CAMERA,
    }


    if (!props.isVisible) return null


    return (
        <ScrollScreen
            style={scrollScreenStyle}
            contentContainerStyle={scrollScreenContentContainerStyle}
        >
            <CameraTextWrapper>
                <CameraMessageTitle variant={"title"} size={"large"}>
                    {translate("Camera_noPermission")}
                </CameraMessageTitle>

                <CameraMessageText variant={"body"} size={"large"}>
                    &bull; {translate("Camera_allowCameraWithGrantPermission")}
                </CameraMessageText>

                <CameraMessageText variant={"body"} size={"large"}>
                    &bull; {translate("Camera_allowCameraThroughSettings")}
                </CameraMessageText>

                <CameraMessageText variant={"body"} size={"large"}>
                    &bull; {translate("Camera_enableCamera")}
                </CameraMessageText>
            </CameraTextWrapper>

            <CameraButtonWrapper>
                <Button
                    variant={"outline"}
                    text={translate("Camera_openSettings")}
                    onPress={Linking.openSettings}
                    style={{ width: "100%" }}
                />

                <Button
                    text={translate("Camera_grantPermission")}
                    onPress={props.requestCameraPermission}
                    style={{ width: "100%" }}
                />
            </CameraButtonWrapper>
        </ScrollScreen>
    )
}

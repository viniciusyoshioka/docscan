import { Button, HEADER_HEIGHT, ScrollScreen } from "@elementium/native"
import { Linking, StatusBar, ViewStyle, useWindowDimensions } from "react-native"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@locales"
import { useCameraControlDimensions } from "./CameraControl"
import { CameraButtonWrapper, CameraMessageText, CameraMessageTitle, CameraTextWrapper } from "./style"


const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0


export interface NoPermissionMessageProps {
    isVisible: boolean;
    requestCameraPermission: () => void;
}


export function NoPermissionMessage(props: NoPermissionMessageProps) {


    const { height } = useWindowDimensions()
    const safeAreaFrame = useSafeAreaFrame()
    const safeAreaInsets = useSafeAreaInsets()

    const cameraControlDimensions = useCameraControlDimensions()
    const { size: cameraControlSize } = cameraControlDimensions

    const heightToDiscount = Math.round(safeAreaFrame.y) === Math.round(STATUS_BAR_HEIGHT) ? 0 : safeAreaFrame.y
    const scrollScreenStyle: ViewStyle = {
        marginTop: HEADER_HEIGHT + safeAreaInsets.top,
        marginBottom: cameraControlSize.HEIGHT_WITHOUT_CAMERA,
    }
    const scrollScreenContentContainerStyle: ViewStyle = {
        minHeight: height - HEADER_HEIGHT - cameraControlSize.HEIGHT_WITHOUT_CAMERA - heightToDiscount,
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

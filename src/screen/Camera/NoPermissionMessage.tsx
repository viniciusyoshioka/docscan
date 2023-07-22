import { Button } from "@elementium/native"
import { Linking } from "react-native"

import { translate } from "../../locales"
import { CAMERA_CONTROL_HEIGHT_WITHOUT_CAMERA, CAMERA_CONTROL_HEIGHT_WITH_CAMERA } from "./CameraControl"
import { CameraButtonWrapper, CameraMessageText, CameraMessageTitle, CameraTextWrapper } from "./style"


export interface NoPermissionMessageProps {
    isVisible: boolean;
    isShowingCamera: boolean;
    requestCameraPermission: () => void;
}


export function NoPermissionMessage(props: NoPermissionMessageProps) {


    if (!props.isVisible) return null


    return <>
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

        <CameraButtonWrapper
            style={{
                paddingBottom: props.isShowingCamera
                    ? CAMERA_CONTROL_HEIGHT_WITH_CAMERA
                    : CAMERA_CONTROL_HEIGHT_WITHOUT_CAMERA,
            }}
        >
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
    </>
}

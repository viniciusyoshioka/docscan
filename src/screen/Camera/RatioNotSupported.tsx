import { ScrollScreen } from "@elementium/native"
import { ViewStyle, useWindowDimensions } from "react-native"

import { HEADER_HEIGHT } from "../../components"
import { translate } from "../../locales"
import { CAMERA_CONTROL_HEIGHT_WITHOUT_CAMERA } from "./CameraControl"
import { CameraMessageText, CameraMessageTitle, CameraTextWrapper } from "./style"


export interface RatioNotSupportedProps {
    isVisible: boolean;
}


// TODO add button to change camera ratio
export function RatioNotSupported(props: RatioNotSupportedProps) {


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
                    {translate("Camera_ratioNotSupported_title")}
                </CameraMessageTitle>

                <CameraMessageText variant={"body"} size={"large"}>
                    {translate("Camera_ratioNotSupported_text")}
                </CameraMessageText>
            </CameraTextWrapper>
        </ScrollScreen>
    )
}

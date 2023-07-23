import { translate } from "../../locales"
import { CameraMessageText, CameraMessageTitle, CameraTextWrapper } from "./style"


export interface RatioNotSupportedProps {
    isVisible: boolean;
}


export function RatioNotSupported(props: RatioNotSupportedProps) {


    if (!props.isVisible) return null


    return <>
        <CameraTextWrapper>
            <CameraMessageTitle variant={"title"} size={"large"}>
                {translate("Camera_ratioNotSupported_title")}
            </CameraMessageTitle>

            <CameraMessageText variant={"body"} size={"large"}>
                {translate("Camera_ratioNotSupported_text")}
            </CameraMessageText>
        </CameraTextWrapper>
    </>
}

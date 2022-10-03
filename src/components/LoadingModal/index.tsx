import { ActivityIndicator } from "react-native"

import { useColorTheme } from "../../services/theme"
import { LoadingModalBackground, LoadingModalText, LoadingModalView } from "./style"


export interface LoadingModalProps {
    visible: boolean;
    message: string;
}


export function LoadingModal(props: LoadingModalProps) {


    const { color, opacity } = useColorTheme()


    if (!props.visible) {
        return undefined
    }


    return (
        <LoadingModalBackground>
            <LoadingModalView>
                <ActivityIndicator
                    size={"large"}
                    color={color.modal_color}
                    style={{ opacity: opacity.highEmphasis }}
                />

                <LoadingModalText>
                    {props.message}
                </LoadingModalText>
            </LoadingModalView>
        </LoadingModalBackground>
    )
}

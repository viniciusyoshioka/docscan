import { ActivityIndicator } from "react-native"

import { useAppTheme } from "../../theme"
import { LoadingModalBackground, LoadingModalText, LoadingModalView } from "./style"


export interface LoadingModalProps {
    visible: boolean;
    message: string;
}


export function LoadingModal(props: LoadingModalProps) {


    const { color } = useAppTheme()


    if (!props.visible) {
        return null
    }


    return (
        <LoadingModalBackground>
            <LoadingModalView>
                <ActivityIndicator
                    size={"large"}
                    color={color.onSurface}
                />

                <LoadingModalText>
                    {props.message}
                </LoadingModalText>
            </LoadingModalView>
        </LoadingModalBackground>
    )
}

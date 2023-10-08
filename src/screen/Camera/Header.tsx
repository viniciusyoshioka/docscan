import { StyleSheet } from "react-native"
import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppTheme } from "@theme"


export interface CameraHeaderProps {
    goBack: () => void;
    openSettings: () => void;
    isShowingCamera: boolean;
}


export function CameraHeader(props: CameraHeaderProps) {


    const safeAreaInsets = useSafeAreaInsets()

    const { isDark } = useAppTheme()

    const headerStyle = !props.isShowingCamera ? styles.headerWithoutCamera : styles.headerWithCamera
    const iconColor = (props.isShowingCamera || isDark) ? "white" : "black"


    return (
        <Appbar.Header style={headerStyle} statusBarHeight={safeAreaInsets.top}>
            <Appbar.BackAction
                iconColor={iconColor}
                onPress={props.goBack}
            />

            <Appbar.Content title={""} />

            <Appbar.Action
                icon={"cog"}
                iconColor={iconColor}
                onPress={props.openSettings}
                disabled={!props.isShowingCamera}
            />
        </Appbar.Header>
    )
}


const styles = StyleSheet.create({
    headerWithCamera: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    headerWithoutCamera: {
        backgroundColor: "transparent",
    },
})

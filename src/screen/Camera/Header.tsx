import { Header, HeaderButton, HeaderTitle } from "@elementium/native"
import { useMemo } from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppTheme } from "../../theme"


export interface CameraHeaderProps {
    goBack: () => void;
    openSettings: () => void;
    isShowingCamera: boolean;
}


export function CameraHeader(props: CameraHeaderProps) {


    const safeAreaInsets = useSafeAreaInsets()

    const { isDark } = useAppTheme()


    const headerStyle = useMemo((): StyleProp<ViewStyle> => {
        if (!props.isShowingCamera) {
            return { ...styles.absolute, backgroundColor: "transparent" }
        }
        return styles.absolute
    }, [props.isShowingCamera])

    function getIconColor() {
        if (props.isShowingCamera || isDark) {
            return "white"
        }
        return "black"
    }


    return (
        <Header style={headerStyle} overrideStatusBar={safeAreaInsets.top !== 0}>
            <HeaderButton
                iconName={"arrow-back"}
                iconColor={getIconColor()}
                onPress={props.goBack}
            />

            <HeaderTitle />

            <HeaderButton
                iconName={"settings"}
                iconColor={getIconColor()}
                onPress={props.openSettings}
                disabled={!props.isShowingCamera}
            />
        </Header>
    )
}


const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        elevation: 0,
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
})

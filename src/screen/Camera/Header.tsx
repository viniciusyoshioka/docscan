import { useMemo } from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { useAppTheme } from "../../theme"


export interface CameraHeaderProps {
    goBack: () => void;
    openSettings: () => void;
    isShowingCamera: boolean;
}


export function CameraHeader(props: CameraHeaderProps) {


    const { isDark } = useAppTheme()


    const headerStyle = useMemo((): StyleProp<ViewStyle> => {
        if (!props.isShowingCamera) {
            return { ...styles.absolute, backgroundColor: "transparent" }
        }
        return styles.absolute
    }, [props.isShowingCamera])

    function getIconColor(enabled: boolean) {
        if (props.isShowingCamera) {
            return "white"
        }
        if (isDark) {
            return enabled ? "white" : "rgb(200, 200, 200)"
        }
        return enabled ? "black" : "rgb(110, 110, 110)"
    }


    return (
        <Header style={headerStyle}>
            <HeaderButton
                iconName={"arrow-back"}
                iconColor={getIconColor(true)}
                onPress={props.goBack}
            />

            <HeaderTitle />

            <HeaderButton
                iconName={"settings"}
                iconColor={getIconColor(props.isShowingCamera)}
                onPress={props.openSettings}
                enabled={props.isShowingCamera}
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
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
})

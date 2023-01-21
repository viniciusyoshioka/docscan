import { useMemo } from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { useAppTheme } from "../../services/theme"


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

    const iconColor = useMemo((): string => {
        if (!props.isShowingCamera) {
            return isDark ? "white" : "black"
        }
        return "white"
    }, [props.isShowingCamera, isDark])


    return (
        <Header style={headerStyle}>
            <HeaderButton
                iconName={"arrow-back"}
                iconColor={iconColor}
                onPress={props.goBack}
            />

            <HeaderTitle />

            <HeaderButton
                iconName={"settings"}
                iconColor={iconColor}
                onPress={props.openSettings}
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

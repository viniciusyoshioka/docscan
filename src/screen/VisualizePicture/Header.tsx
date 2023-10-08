import { StyleSheet } from "react-native"
import { Appbar } from "react-native-paper"

import { useAppTheme } from "@theme"


export interface VisualizePictureHeaderProps {
    goBack: () => void;
    replacePicture: () => void;
    rotation: {
        isActive: boolean;
        open: () => void;
        exit: () => void;
        save: () => void;
        rotateLeft: () => void;
        rotateRight: () => void;
    };
    crop: {
        isActive: boolean;
        open: () => void;
        exit: () => void;
        save: () => void;
    };
    isShowingOverlay: boolean;
}


export function VisualizePictureHeader(props: VisualizePictureHeaderProps) {


    const { isDark } = useAppTheme()

    const headerColor = isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)"
    const iconColor = isDark ? "white" : "black"


    if (!props.isShowingOverlay) return null


    if (props.rotation.isActive) return (
        <Appbar.Header style={styles.relative} statusBarHeight={0}>
            <Appbar.Action
                icon={"close"}
                iconColor={iconColor}
                onPress={props.rotation.exit}
                animated={false}
            />

            <Appbar.Content title={""} />

            <Appbar.Action
                icon={"rotate-left"}
                iconColor={iconColor}
                onPress={props.rotation.rotateLeft}
                animated={false}
            />

            <Appbar.Action
                icon={"rotate-right"}
                iconColor={iconColor}
                onPress={props.rotation.rotateRight}
                animated={false}
            />

            <Appbar.Action
                icon={"check"}
                iconColor={iconColor}
                onPress={props.rotation.save}
                animated={false}
            />
        </Appbar.Header>
    )

    if (props.crop.isActive) return (
        <Appbar.Header style={styles.relative} statusBarHeight={0}>
            <Appbar.Action
                icon={"close"}
                iconColor={iconColor}
                onPress={props.crop.exit}
                animated={false}
            />

            <Appbar.Content title={""} />

            <Appbar.Action
                icon={"check"}
                iconColor={iconColor}
                onPress={props.crop.save}
                animated={false}
            />
        </Appbar.Header>
    )

    return (
        <Appbar.Header style={[styles.absolute, { backgroundColor: headerColor } ]} statusBarHeight={0}>
            <Appbar.BackAction
                iconColor={iconColor}
                onPress={props.goBack}
                animated={false}
            />

            <Appbar.Content title={""} />

            <Appbar.Action
                icon={"image-edit-outline"}
                iconColor={iconColor}
                onPress={props.replacePicture}
                animated={false}
            />

            <Appbar.Action
                icon={"refresh"}
                iconColor={iconColor}
                onPress={props.rotation.open}
                animated={false}
            />

            <Appbar.Action
                icon={"crop"}
                iconColor={iconColor}
                onPress={props.crop.open}
                animated={false}
            />
        </Appbar.Header>
    )
}


const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        elevation: 0,
        zIndex: 1,
    },
    relative: {
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        elevation: 0,
        zIndex: 1,
    },
})

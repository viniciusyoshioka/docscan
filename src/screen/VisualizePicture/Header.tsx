import { Header, HeaderButton, HeaderTitle } from "@elementium/native"
import { StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"


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


    const safeAreaInsets = useSafeAreaInsets()


    if (!props.isShowingOverlay) return null


    if (props.rotation.isActive) return (
        <Header style={styles.relative}>
            <HeaderButton
                iconName={"close"}
                iconColor={"white"}
                onPress={props.rotation.exit}
            />

            <HeaderTitle />

            <HeaderButton
                iconName={"rotate-left"}
                iconColor={"white"}
                onPress={props.rotation.rotateLeft}
            />

            <HeaderButton
                iconName={"rotate-right"}
                iconColor={"white"}
                onPress={props.rotation.rotateRight}
            />

            <HeaderButton
                iconName={"done"}
                iconColor={"white"}
                onPress={props.rotation.save}
            />
        </Header>
    )

    if (props.crop.isActive) return (
        <Header style={styles.relative}>
            <HeaderButton
                iconName={"close"}
                iconColor={"white"}
                onPress={props.crop.exit}
            />

            <HeaderTitle />

            <HeaderButton
                iconName={"done"}
                iconColor={"white"}
                onPress={props.crop.save}
            />
        </Header>
    )

    return (
        <Header style={styles.absolute} overrideStatusBar={safeAreaInsets.top !== 0}>
            <HeaderButton
                iconName={"arrow-back"}
                iconColor={"white"}
                onPress={props.goBack}
            />

            <HeaderTitle />

            <HeaderButton
                iconName={"image-edit-outline"}
                iconGroup={"material-community"}
                iconColor={"white"}
                onPress={props.replacePicture}
            />

            <HeaderButton
                iconName={"refresh"}
                iconColor={"white"}
                onPress={props.rotation.open}
                style={{ transform: [ { rotateY: "180deg" } ] }}
            />

            <HeaderButton
                iconName={"crop"}
                iconColor={"white"}
                onPress={props.crop.open}
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
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        elevation: 0,
        zIndex: 1,
    },
    relative: {
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        elevation: 0,
        zIndex: 1,
    },
})

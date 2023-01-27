import { useMemo } from "react"
import { StyleSheet } from "react-native"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface VisualizePictureHeaderProps {
    goBack: () => void;
    isCropping: boolean;
    openCamera: () => void;
    openCrop: () => void;
    exitCrop: () => void;
    saveCroppedPicture: () => void;
}


export function VisualizePictureHeader(props: VisualizePictureHeaderProps) {


    const headerStyle = useMemo(() => !props.isCropping ? styles.absolute : undefined, [props.isCropping])


    return (
        <Header style={headerStyle}>
            {!props.isCropping && (
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            {props.isCropping && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitCrop}
                />
            )}

            <HeaderTitle />

            {!props.isCropping && (
                <HeaderButton
                    iconName={"image-edit-outline"}
                    iconGroup={"material-community"}
                    onPress={props.openCamera}
                />
            )}

            {!props.isCropping && (
                <HeaderButton
                    iconName={"crop"}
                    onPress={props.openCrop}
                />
            )}

            {props.isCropping && (
                <HeaderButton
                    iconName={"done"}
                    onPress={props.saveCroppedPicture}
                />
            )}
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
})

import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface VisualizePictureHeaderProps {
    goBack: () => void;
    isCropping: boolean;
    openCamera: () => void;
    setIsCropping: (newIsCropping: boolean) => void;
    saveCroppedPicture: () => void;
}


export function VisualizePictureHeader(props: VisualizePictureHeaderProps) {
    return (
        <Header>
            {!props.isCropping && (
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            {props.isCropping && (
                <HeaderButton
                    iconName={"close"}
                    onPress={() => props.setIsCropping(false)}
                />
            )}

            {!props.isCropping && (
                <HeaderTitle title={"Visualizar foto"} />
            )}

            {props.isCropping && (
                <HeaderTitle title={"Cortar foto"} />
            )}

            {!props.isCropping && (
                <HeaderButton
                    iconName={"add-a-photo"}
                    onPress={props.openCamera}
                />
            )}

            {!props.isCropping && (
                <HeaderButton
                    iconName={"crop"}
                    onPress={() => props.setIsCropping(true)}
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

import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { translate } from "../../locales"


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
                <HeaderTitle title={translate("VisualizePicture_header_visualize_title")} />
            )}

            {props.isCropping && (
                <HeaderTitle title={translate("VisualizePicture_header_crop_title")} />
            )}

            {!props.isCropping && (
                <HeaderButton
                    iconName={"add-photo-alternate"}
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

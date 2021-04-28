import React from "react"

import { Header, BlockLeft, HeaderButton, BlockCenter, HeaderTitle, BlockRight } from "../../component/Header"


export interface VisualizePictureHeaderProps {
    goBack: () => void,
    isCropping: boolean,
    openCamera: () => void,
    setIsCropping: (newIsCropping: boolean) => void,
    saveCroppedPicture: () => void,
}


export function VisualizePictureHeader(props: VisualizePictureHeaderProps) {
    return (
        <Header>
            <BlockLeft>
                {!props.isCropping && (
                    <HeaderButton
                        iconName={"md-arrow-back"}
                        onPress={props.goBack}
                    />
                )}

                {props.isCropping && (
                    <HeaderButton
                        iconName={"md-close"}
                        onPress={() => props.setIsCropping(false)}
                    />
                )}
            </BlockLeft>

            <BlockCenter>
                {!props.isCropping && (
                    <HeaderTitle>
                        Visualizar foto
                    </HeaderTitle>
                )}

                {props.isCropping && (
                    <HeaderTitle>
                        Cortar foto
                    </HeaderTitle>
                )}
            </BlockCenter>

            <BlockRight>
                {!props.isCropping && (
                    <HeaderButton
                        iconName={"md-camera-outline"}
                        onPress={props.openCamera}
                    />
                )}
                {!props.isCropping && (
                    <HeaderButton
                        iconName={"md-crop"}
                        onPress={() => props.setIsCropping(true)}
                    />
                )}

                {props.isCropping && (
                    <HeaderButton
                        iconName={"md-checkmark-sharp"}
                        onPress={props.saveCroppedPicture}
                    />
                )}
            </BlockRight>
        </Header>
    )
}

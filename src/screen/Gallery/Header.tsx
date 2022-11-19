import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { translate } from "../../locales"


export interface GalleryHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    importImage: () => void;
    isSelectionMode: boolean;
    selectedImagesAmount: number;
}


export function GalleryHeader(props: GalleryHeaderProps) {


    function getTitle(): string {
        if (props.isSelectionMode) {
            return props.selectedImagesAmount.toString()
        }
        return translate("Gallery_header_title")
    }


    return (
        <Header>
            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            {!props.isSelectionMode && (
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            <HeaderTitle title={getTitle()} />

            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"done"}
                    onPress={props.importImage}
                />
            )}
        </Header>
    )
}

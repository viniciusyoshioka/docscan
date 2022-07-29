import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface GalleryHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    importImage: () => void;
    selectionMode: boolean;
}


export function GalleryHeader(props: GalleryHeaderProps) {
    return (
        <Header>
            {props.selectionMode && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            {!props.selectionMode && (
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            {!props.selectionMode && (
                <HeaderTitle title={"Importar imagem"} />
            )}

            {props.selectionMode && (
                <HeaderTitle />
            )}

            {props.selectionMode && (
                <HeaderButton
                    iconName={"done"}
                    onPress={props.importImage}
                />
            )}
        </Header>
    )
}

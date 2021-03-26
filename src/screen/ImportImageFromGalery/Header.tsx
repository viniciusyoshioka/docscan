import React from "react"

import { BlockCenter, BlockLeft, BlockRight, Header, HeaderButton, HeaderTitle } from "../../component/Header"


export interface ImportImageFromGaleryHeaderProps {
    goBack: () => void,
    importImage: () => void,
    selectionMode: boolean,
}


export default function ImportImageFromGaleryHeader(props: ImportImageFromGaleryHeaderProps) {
    return (
        <Header>
            <BlockLeft>
                <HeaderButton
                    iconName={"md-arrow-back"}
                    onPress={props.goBack}
                />
            </BlockLeft>

            <BlockCenter>
                <HeaderTitle>
                    Importar imagem
                </HeaderTitle>
            </BlockCenter>

            {props.selectionMode && (
                <BlockRight>
                    <HeaderButton
                        iconName={"md-checkmark"}
                        onPress={props.importImage}
                    />
                </BlockRight>
            )}
        </Header>
    )
}

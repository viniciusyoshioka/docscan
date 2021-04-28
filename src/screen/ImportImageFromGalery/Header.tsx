import React from "react"

import { BlockCenter, BlockLeft, BlockRight, Header, HeaderButton, HeaderTitle } from "../../component/Header"


export interface ImportImageFromGaleryHeaderProps {
    goBack: () => void,
    exitSelectionMode: () => void,
    importImage: () => void,
    selectionMode: boolean,
}


export function ImportImageFromGaleryHeader(props: ImportImageFromGaleryHeaderProps) {
    return (
        <Header>
            <BlockLeft>
                {props.selectionMode && (
                    <HeaderButton
                        iconName={"md-close"}
                        onPress={props.exitSelectionMode}
                    />
                )}

                {!props.selectionMode && (
                    <HeaderButton
                        iconName={"md-arrow-back"}
                        onPress={props.goBack}
                    />
                )}
            </BlockLeft>

            {!props.selectionMode && (
                <BlockCenter>
                    <HeaderTitle>
                        Importar imagem
                    </HeaderTitle>
                </BlockCenter>
            )}

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

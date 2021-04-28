import React, { Component } from "react"

import { BlockCenter, BlockLeft, BlockRight, Header, HeaderButton, HeaderTitle } from "../../component/Header"


export interface ImportImageFromGaleryHeaderProps {
    goBack: () => void,
    exitSelectionMode: () => void,
    importImage: () => void,
    selectionMode: boolean,
}


export class ImportImageFromGaleryHeader extends Component<ImportImageFromGaleryHeaderProps> {


    constructor(props: ImportImageFromGaleryHeaderProps) {
        super(props)
    }


    shouldComponentUpdate(nextProps: ImportImageFromGaleryHeaderProps) {
        if (this.props.selectionMode !== nextProps.selectionMode) {
            return true
        }
        return false
    }


    render() {
        return (
            <Header>
                <BlockLeft>
                    {this.props.selectionMode && (
                        <HeaderButton
                            iconName={"md-close"}
                            onPress={this.props.exitSelectionMode}
                        />
                    )}

                    {!this.props.selectionMode && (
                        <HeaderButton
                            iconName={"md-arrow-back"}
                            onPress={this.props.goBack}
                        />
                    )}
                </BlockLeft>

                {!this.props.selectionMode && (
                    <BlockCenter>
                        <HeaderTitle>
                            Importar imagem
                        </HeaderTitle>
                    </BlockCenter>
                )}

                {this.props.selectionMode && (
                    <BlockRight>
                        <HeaderButton
                            iconName={"md-checkmark"}
                            onPress={this.props.importImage}
                        />
                    </BlockRight>
                )}
            </Header>
        )
    }
}

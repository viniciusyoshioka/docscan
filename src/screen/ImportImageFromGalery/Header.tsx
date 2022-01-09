import React, { Component } from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface ImportImageFromGaleryHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    importImage: () => void;
    selectionMode: boolean;
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
                {this.props.selectionMode && (
                    <HeaderButton
                        icon={"close"}
                        onPress={this.props.exitSelectionMode}
                    />
                )}

                {!this.props.selectionMode && (
                    <HeaderButton
                        icon={"arrow-back"}
                        onPress={this.props.goBack}
                    />
                )}

                {!this.props.selectionMode && (
                    <HeaderTitle title={"Importar imagem"} />
                )}

                {this.props.selectionMode && (
                    <HeaderTitle />
                )}

                {this.props.selectionMode && (
                    <HeaderButton
                        icon={"done"}
                        onPress={this.props.importImage}
                    />
                )}
            </Header>
        )
    }
}

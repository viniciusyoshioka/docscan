import React, { Component } from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface GalleryHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    importImage: () => void;
    selectionMode: boolean;
}


export class GalleryHeader extends Component<GalleryHeaderProps> {


    constructor(props: GalleryHeaderProps) {
        super(props)
    }


    shouldComponentUpdate(nextProps: GalleryHeaderProps) {
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
                        iconName={"close"}
                        onPress={this.props.exitSelectionMode}
                    />
                )}

                {!this.props.selectionMode && (
                    <HeaderButton
                        iconName={"arrow-back"}
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
                        iconName={"done"}
                        onPress={this.props.importImage}
                    />
                )}
            </Header>
        )
    }
}

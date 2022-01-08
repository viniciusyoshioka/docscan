import React, { Component } from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface VisualizePictureHeaderProps {
    goBack: () => void,
    isCropping: boolean,
    openCamera: () => void,
    setIsCropping: (newIsCropping: boolean) => void,
    saveCroppedPicture: () => void,
}


export class VisualizePictureHeader extends Component<VisualizePictureHeaderProps> {


    constructor(props: VisualizePictureHeaderProps) {
        super(props)
    }


    shouldComponentUpdate(nextProps: VisualizePictureHeaderProps) {
        if (this.props.isCropping !== nextProps.isCropping) {
            return true
        }
        return false
    }


    render() {
        return (
            <Header>
                {!this.props.isCropping && (
                    <HeaderButton
                        icon={"arrow-back"}
                        onPress={this.props.goBack}
                    />
                )}

                {this.props.isCropping && (
                    <HeaderButton
                        icon={"close"}
                        onPress={() => this.props.setIsCropping(false)}
                    />
                )}

                {!this.props.isCropping && (
                    <HeaderTitle title={"Visualizar foto"} />
                )}

                {this.props.isCropping && (
                    <HeaderTitle title={"Cortar foto"} />
                )}

                {!this.props.isCropping && (
                    <HeaderButton
                        icon={"add-a-photo"}
                        onPress={this.props.openCamera}
                    />
                )}

                {!this.props.isCropping && (
                    <HeaderButton
                        icon={"crop"}
                        onPress={() => this.props.setIsCropping(true)}
                    />
                )}

                {this.props.isCropping && (
                    <HeaderButton
                        icon={"done"}
                        onPress={this.props.saveCroppedPicture}
                    />
                )}
            </Header>
        )
    }
}

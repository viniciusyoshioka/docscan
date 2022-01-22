import React, { Component } from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface VisualizePictureHeaderProps {
    goBack: () => void;
    isCropping: boolean;
    openCamera: () => void;
    setIsCropping: (newIsCropping: boolean) => void;
    saveCroppedPicture: () => void;
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
                        iconName={"arrow-back"}
                        onPress={this.props.goBack}
                    />
                )}

                {this.props.isCropping && (
                    <HeaderButton
                        iconName={"close"}
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
                        iconName={"add-a-photo"}
                        onPress={this.props.openCamera}
                    />
                )}

                {!this.props.isCropping && (
                    <HeaderButton
                        iconName={"crop"}
                        onPress={() => this.props.setIsCropping(true)}
                    />
                )}

                {this.props.isCropping && (
                    <HeaderButton
                        iconName={"done"}
                        onPress={this.props.saveCroppedPicture}
                    />
                )}
            </Header>
        )
    }
}

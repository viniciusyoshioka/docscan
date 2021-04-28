import React, { Component } from "react"

import { Header, BlockLeft, HeaderButton, BlockCenter, HeaderTitle, BlockRight } from "../../component/Header"


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
                <BlockLeft>
                    {!this.props.isCropping && (
                        <HeaderButton
                            iconName={"md-arrow-back"}
                            onPress={this.props.goBack}
                        />
                    )}

                    {this.props.isCropping && (
                        <HeaderButton
                            iconName={"md-close"}
                            onPress={() => this.props.setIsCropping(false)}
                        />
                    )}
                </BlockLeft>

                <BlockCenter>
                    {!this.props.isCropping && (
                        <HeaderTitle>
                            Visualizar foto
                        </HeaderTitle>
                    )}

                    {this.props.isCropping && (
                        <HeaderTitle>
                            Cortar foto
                        </HeaderTitle>
                    )}
                </BlockCenter>

                <BlockRight>
                    {!this.props.isCropping && (
                        <HeaderButton
                            iconName={"md-camera-outline"}
                            onPress={this.props.openCamera}
                        />
                    )}
                    {!this.props.isCropping && (
                        <HeaderButton
                            iconName={"md-crop"}
                            onPress={() => this.props.setIsCropping(true)}
                        />
                    )}

                    {this.props.isCropping && (
                        <HeaderButton
                            iconName={"md-checkmark-sharp"}
                            onPress={this.props.saveCroppedPicture}
                        />
                    )}
                </BlockRight>
            </Header>
        )
    }
}

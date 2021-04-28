import React, { Component } from "react"

import { Header, BlockLeft, HeaderButton, BlockCenter, HeaderTitle, BlockRight } from "../../component/Header"
import { EditDocumentMenu } from "./EditDocumentMenu"


export interface EditDocumentHeaderProps {
    goBack: () => void,
    exitSelectionMode: () => void,
    documentName: string,
    selectionMode: boolean,
    deletePicture: () => void,
    openCamera: () => void,
    renameDocument: () => void,
    exportToPdf: () => void,
    discardDocument: () => void,
    shareDocument: () => void,
}


export class EditDocumentHeader extends Component<EditDocumentHeaderProps> {


    constructor(props: EditDocumentHeaderProps) {
        super(props)
    }


    shouldComponentUpdate(nextProps: EditDocumentHeaderProps) {
        if (this.props.selectionMode !== nextProps.selectionMode) {
            return true
        } else if (this.props.documentName !== nextProps.documentName) {
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
                            {this.props.documentName}
                        </HeaderTitle>
                    </BlockCenter>
                )}

                {this.props.selectionMode && (
                    <BlockRight>
                        <HeaderButton
                            iconName={"md-trash-outline"}
                            onPress={this.props.deletePicture} 
                        />
                    </BlockRight>
                )}

                {!this.props.selectionMode && (
                    <BlockRight>
                        <HeaderButton
                            iconName={"md-camera-outline"}
                            onPress={this.props.openCamera}
                        />

                        <EditDocumentMenu 
                            renameDocument={this.props.renameDocument}
                            exportToPdf={this.props.exportToPdf}
                            discardDocument={this.props.discardDocument}
                            shareDocument={this.props.shareDocument}
                        />
                    </BlockRight>
                )}
            </Header>
        )
    }
}

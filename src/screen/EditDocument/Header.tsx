import React from "react"

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
    convertToPdf: () => void,
    discardDocument: () => void,
    shareDocument: () => void,
    visualizePdf: () => void,
}


export function EditDocumentHeader(props: EditDocumentHeaderProps) {
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
                        {props.documentName}
                    </HeaderTitle>
                </BlockCenter>
            )}

            {props.selectionMode && (
                <BlockRight>
                    <HeaderButton
                        iconName={"md-trash"}
                        onPress={props.deletePicture} 
                    />
                </BlockRight>
            )}

            {!props.selectionMode && (
                <BlockRight>
                    <HeaderButton
                        iconName={"md-camera"}
                        onPress={props.openCamera}
                    />

                    <EditDocumentMenu 
                        renameDocument={props.renameDocument}
                        convertToPdf={props.convertToPdf}
                        discardDocument={props.discardDocument}
                        shareDocument={props.shareDocument}
                        visualizePdf={props.visualizePdf}
                    />
                </BlockRight>
            )}
        </Header>
    )
}

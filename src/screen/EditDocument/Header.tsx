import React from "react"

import { Header, BlockLeft, HeaderButton, BlockCenter, HeaderTitle, BlockRight } from "../../component/Header"
import EditDocumentMenu from "./EditDocumentMenu"


export interface EditDocumentHeaderProps {
    goBack: () => void,
    exitSelectionMode: () => void,
    documentName: string,
    selectionMode: boolean,
    changed: boolean,
    isNewDocument: boolean,
    deletePicture: () => void,
    openCamera: () => void,
    saveDocument: () => void,
    renameDocument: () => void,
    exportToPdf: () => void,
    discardDocument: () => void,
}


export default function EditDocumentHeader(props: EditDocumentHeaderProps) {
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
                        {`${props.changed ? "*" : ""}${props.documentName}`}
                    </HeaderTitle>
                </BlockCenter>
            )}

            {props.selectionMode && (
                <BlockRight>
                    <HeaderButton
                        iconName={"md-trash-outline"}
                        onPress={props.deletePicture} 
                    />
                </BlockRight>
            )}

            {!props.selectionMode && (
                <BlockRight>
                    {(props.isNewDocument === false) && (
                        <HeaderButton
                            iconName={"md-camera-outline"}
                            onPress={props.openCamera}
                        />
                    )}

                    <HeaderButton 
                        iconName={"md-save-outline"}
                        onPress={props.saveDocument}
                    />

                    <EditDocumentMenu 
                        renameDocument={props.renameDocument}
                        exportToPdf={props.exportToPdf}
                        discardDocument={props.discardDocument}
                    />
                </BlockRight>
            )}
        </Header>
    )
}

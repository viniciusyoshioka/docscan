import React from "react"

import { EditDocumentMenu } from "./EditDocumentMenu"
import { Header, HeaderButton, HeaderTitle } from "../../component"


export interface EditDocumentHeaderProps {
    goBack: () => void,
    exitSelectionMode: () => void,
    documentName: string,
    selectionMode: boolean,
    deletePicture: () => void,
    openCamera: () => void,
    renameDocument: () => void,
    convertToPdf: () => void,
    deleteDocument: () => void,
    shareDocument: () => void,
    visualizePdf: () => void,
}


export function EditDocumentHeader(props: EditDocumentHeaderProps) {
    return (
        <Header>
            {props.selectionMode && (
                <HeaderButton
                    icon={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            {!props.selectionMode && (
                <HeaderButton
                    icon={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            {!props.selectionMode && (
                <HeaderTitle title={props.documentName} />
            )}

            {props.selectionMode && (
                <HeaderTitle />
            )}

            {props.selectionMode && (
                <HeaderButton
                    icon={"delete"}
                    onPress={props.deletePicture}
                />
            )}

            {!props.selectionMode && (
                <>
                    <HeaderButton
                        icon={"add-a-photo"}
                        onPress={props.openCamera}
                    />

                    <EditDocumentMenu
                        renameDocument={props.renameDocument}
                        convertToPdf={props.convertToPdf}
                        deleteDocument={props.deleteDocument}
                        shareDocument={props.shareDocument}
                        visualizePdf={props.visualizePdf}
                    />
                </>
            )}
        </Header>
    )
}

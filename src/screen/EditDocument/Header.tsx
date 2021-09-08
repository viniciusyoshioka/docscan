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
    shareDocument: () => void,
    visualizePdf: () => void,
    deletePdf: () => void,
    deleteDocument: () => void,
}


export function EditDocumentHeader(props: EditDocumentHeaderProps) {
    return (
        <Header>
            {!props.selectionMode && (
                <>
                    <HeaderButton
                        icon={"arrow-back"}
                        onPress={props.goBack}
                    />

                    <HeaderTitle title={props.documentName} />

                    <HeaderButton
                        icon={"add-a-photo"}
                        onPress={props.openCamera}
                    />

                    <EditDocumentMenu
                        convertToPdf={props.convertToPdf}
                        shareDocument={props.shareDocument}
                        visualizePdf={props.visualizePdf}
                        renameDocument={props.renameDocument}
                        deletePdf={props.deletePdf}
                        deleteDocument={props.deleteDocument}
                    />
                </>
            )}

            {props.selectionMode && (
                <>
                    <HeaderButton
                        icon={"close"}
                        onPress={props.exitSelectionMode}
                    />

                    <HeaderTitle />

                    <HeaderButton
                        icon={"delete"}
                        onPress={props.deletePicture}
                    />
                </>
            )}
        </Header>
    )
}

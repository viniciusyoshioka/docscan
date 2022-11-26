import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { useDocumentData } from "../../services/document"
import { EditDocumentMenu } from "./EditDocumentMenu"


export interface EditDocumentHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    isSelectionMode: boolean;
    selectedPicturesAmount: number;
    deletePicture: () => void;
    openCamera: () => void;
    convertToPdf: () => void;
    shareDocument: () => void;
    visualizePdf: () => void;
    renameDocument: () => void;
    deletePdf: () => void;
    deleteDocument: () => void;
}


export function EditDocumentHeader(props: EditDocumentHeaderProps) {


    const { documentDataState } = useDocumentData()


    function getTitle() {
        if (!props.isSelectionMode) {
            return documentDataState?.name ?? ""
        }
        return props.selectedPicturesAmount.toString()
    }


    return (
        <Header>
            {!props.isSelectionMode && (
                <HeaderButton
                    iconName={"arrow-back"}
                    onPress={props.goBack}
                />
            )}

            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            <HeaderTitle title={getTitle()} />

            {!props.isSelectionMode && (
                <HeaderButton
                    iconName={"add-a-photo"}
                    onPress={props.openCamera}
                />
            )}

            {!props.isSelectionMode && (
                <EditDocumentMenu
                    convertToPdf={props.convertToPdf}
                    shareDocument={props.shareDocument}
                    visualizePdf={props.visualizePdf}
                    renameDocument={props.renameDocument}
                    deletePdf={props.deletePdf}
                    deleteDocument={props.deleteDocument}
                />
            )}

            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"delete"}
                    onPress={props.deletePicture}
                />
            )}
        </Header>
    )
}

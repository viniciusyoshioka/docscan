import React from "react"

import { EditDocumentMenu } from "./EditDocumentMenu"
import { Header, HeaderButton, HeaderTitle } from "../../components"
import { useDocumentData } from "../../services/document"


export interface EditDocumentHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    selectionMode: boolean;
    deletePicture: () => void;
    openCamera: () => void;
    renameDocument: () => void;
    convertToPdf: () => void;
    shareDocument: () => void;
    visualizePdf: () => void;
    deletePdf: () => void;
    deleteDocument: () => void;
}


export const EditDocumentHeader = (props: EditDocumentHeaderProps) => {


    const { documentDataState } = useDocumentData()


    return (
        <Header>
            {!props.selectionMode && (
                <>
                    <HeaderButton
                        iconName={"arrow-back"}
                        onPress={props.goBack}
                    />

                    <HeaderTitle title={documentDataState?.name || ""} />

                    <HeaderButton
                        iconName={"add-a-photo"}
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
                        iconName={"close"}
                        onPress={props.exitSelectionMode}
                    />

                    <HeaderTitle />

                    <HeaderButton
                        iconName={"delete"}
                        onPress={props.deletePicture}
                    />
                </>
            )}
        </Header>
    )
}

import { useNavigation } from "@react-navigation/native"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { useDocumentModel } from "../../database"
import { NavigationParamProps } from "../../router"
import { DocumentService } from "../../services/document"
import { EditDocumentMenu } from "./EditDocumentMenu"


export interface EditDocumentHeaderProps {
    goBack: () => void;
    exitSelectionMode: () => void;
    isSelectionMode: boolean;
    selectedPicturesAmount: number;
    invertSelection: () => void;
    deletePicture: () => void;
    openCamera: () => void;
    shareDocument: () => void;
    visualizePdf: () => void;
    deletePdf: () => void;
    deleteDocument: () => void;
}


export function EditDocumentHeader(props: EditDocumentHeaderProps) {


    const navigation = useNavigation<NavigationParamProps<"EditDocument">>()

    const { documentModel } = useDocumentModel()
    const document = documentModel?.document ?? null


    function getTitle() {
        if (!props.isSelectionMode) {
            return document?.name ?? DocumentService.getNewName()
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

            {!props.isSelectionMode && <>
                <HeaderButton
                    iconName={"add-a-photo"}
                    onPress={props.openCamera}
                />

                <EditDocumentMenu
                    convertToPdf={() => navigation.navigate("ConvertPdfOption")}
                    shareDocument={props.shareDocument}
                    visualizePdf={props.visualizePdf}
                    renameDocument={() => navigation.navigate("RenameDocument")}
                    deletePdf={props.deletePdf}
                    deleteDocument={props.deleteDocument}
                />
            </>}

            {props.isSelectionMode && <>
                <HeaderButton
                    iconName={"swap-horiz"}
                    onPress={props.invertSelection}
                />

                <HeaderButton
                    iconName={"delete"}
                    onPress={props.deletePicture}
                />
            </>}
        </Header>
    )
}

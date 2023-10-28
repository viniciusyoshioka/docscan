import { useNavigation } from "@react-navigation/native"
import { Appbar } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useDocumentModel } from "@database"
import { NavigationParamProps } from "@router"
import { DocumentService } from "@services/document"
import { EditDocumentMenu } from "./EditDocumentMenu"


export interface EditDocumentHeaderProps {
    goBack: () => void
    exitSelectionMode: () => void
    isSelectionMode: boolean
    selectedPicturesAmount: number
    invertSelection: () => void
    deletePicture: () => void
    openCamera: () => void
    shareDocument: () => void
    visualizePdf: () => void
    deletePdf: () => void
    deleteDocument: () => void
}


export function EditDocumentHeader(props: EditDocumentHeaderProps) {


    const navigation = useNavigation<NavigationParamProps<"EditDocument">>()
    const safeAreaInsets = useSafeAreaInsets()

    const { documentModel } = useDocumentModel()
    const document = documentModel?.document ?? null


    function getTitle() {
        if (!props.isSelectionMode) {
            return document?.name ?? DocumentService.getNewName()
        }
        return props.selectedPicturesAmount.toString()
    }


    return (
        <Appbar.Header elevated={true} statusBarHeight={safeAreaInsets.top}>
            {!props.isSelectionMode && (
                <Appbar.BackAction onPress={props.goBack} />
            )}

            {props.isSelectionMode && (
                <Appbar.Action icon={"close"} onPress={props.exitSelectionMode} />
            )}

            <Appbar.Content title={getTitle()} />

            {!props.isSelectionMode && <>
                <Appbar.Action icon={"camera-plus-outline"} onPress={props.openCamera} />

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
                <Appbar.Action icon={"swap-horizontal"} onPress={props.invertSelection} />

                <Appbar.Action icon={"trash-can-outline"} onPress={props.deletePicture} />
            </>}
        </Appbar.Header>
    )
}

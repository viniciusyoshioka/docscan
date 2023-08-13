import { AnimatedHeader, AnimatedHeaderRef, HeaderButton, HeaderTitle } from "@elementium/native"
import { useNavigation } from "@react-navigation/native"
import { ForwardedRef, forwardRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

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


export const EditDocumentHeader = forwardRef((props: EditDocumentHeaderProps, ref: ForwardedRef<AnimatedHeaderRef>) => {


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
        <AnimatedHeader ref={ref} overrideStatusBar={safeAreaInsets.top !== 0}>
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
        </AnimatedHeader>
    )
})

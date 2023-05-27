import { Screen } from "@elementium/native"
import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useMemo, useState } from "react"
import { Alert, useWindowDimensions } from "react-native"

import { DocumentPicture, useDocumentModel } from "../../database"
import { useBackHandler, useSelectionMode } from "../../hooks"
import { translate } from "../../locales"
import { NavigationParamProps, RouteParamProps } from "../../types"
import { ConvertPdfOption } from "./ConvertPdfOption"
import { EditDocumentHeader } from "./Header"
import { HORIZONTAL_COLUMN_COUNT, PictureItem, VERTICAL_COLUMN_COUNT, getPictureItemSize } from "./Pictureitem"
import { RenameDocument } from "./RenameDocument"
import { useLoadDocument } from "./useLoadDocument"


// TODO implement drag and drop to reorder list
// TODO implement split selected images to new document
export function EditDocument() {


    const navigation = useNavigation<NavigationParamProps<"EditDocument">>()
    const { params } = useRoute<RouteParamProps<"EditDocument">>()
    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    const { documentModel, setDocumentModel } = useDocumentModel()

    const columnCount = useMemo(() => (windowWidth < windowHeight)
        ? VERTICAL_COLUMN_COUNT
        : HORIZONTAL_COLUMN_COUNT
    , [windowWidth, windowHeight])
    const estimatedItemSize = useMemo(() => getPictureItemSize(windowWidth, columnCount), [windowWidth, columnCount])

    const pictureSelection = useSelectionMode<number>()
    const [renameDocumentVisible, setRenameDocumentVisible] = useState(false)
    const [convertPdfOptionVisible, setConvertPdfOptionVisible] = useState(false)


    useLoadDocument(params?.documentId)


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        if (pictureSelection.isSelectionMode) {
            pictureSelection.exitSelection()
            return
        }

        setDocumentModel({ type: "close", payload: undefined })
        navigation.reset({ routes: [ { name: "Home" } ] })
    }

    // TODO reimplement convertDocumentToPdf
    async function convertDocumentToPdf(quality: number) {}

    // TODO reimplement shareDocument
    async function shareDocument() {}

    // TODO reimplement visualizePdf
    async function visualizePdf() {}

    // TODO reimplement deletePdf
    async function deletePdf() {}

    function alertDeletePdf() {
        Alert.alert(
            translate("EditDocument_alert_deletePdf_title"),
            translate("EditDocument_alert_deletePdf_text"),
            [
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("ok"), onPress: deletePdf },
            ]
        )
    }

    // TODO reimplement deleteCurrentDocument
    async function deleteCurrentDocument() {}

    function alertDeleteCurrentDocument() {
        Alert.alert(
            translate("EditDocument_alert_deleteDocument_title"),
            translate("EditDocument_alert_deleteDocument_text"),
            [
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("ok"), onPress: deleteCurrentDocument },
            ]
        )
    }

    // TODO reimplement invertSelection
    function invertSelection() {}

    // TODO reimplement deleteSelectedPicture
    async function deleteSelectedPicture() {}

    function alertDeletePicture() {
        Alert.alert(
            translate("EditDocument_alert_deletePicture_title"),
            translate("EditDocument_alert_deletePicture_text"),
            [
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("ok"), onPress: deleteSelectedPicture },
            ]
        )
    }

    function renderItem({ item, index }: { item: DocumentPicture, index: number }) {
        return (
            <PictureItem
                onClick={() => navigation.navigate("VisualizePicture", { pictureIndex: index })}
                onSelect={() => pictureSelection.selectItem(index)}
                onDeselect={() => pictureSelection.deselectItem(index)}
                isSelectionMode={pictureSelection.isSelectionMode}
                isSelected={pictureSelection.selectedData.includes(index)}
                picturePath={item.filePath}
                columnCount={columnCount}
            />
        )
    }

    const keyExtractor = useCallback((_: DocumentPicture, index: number) => index.toString(), [])


    return (
        <Screen>
            <EditDocumentHeader
                goBack={goBack}
                exitSelectionMode={pictureSelection.exitSelection}
                isSelectionMode={pictureSelection.isSelectionMode}
                selectedPicturesAmount={pictureSelection.selectedData.length}
                invertSelection={invertSelection}
                deletePicture={alertDeletePicture}
                openCamera={() => navigation.navigate("Camera")}
                convertToPdf={() => setConvertPdfOptionVisible(true)}
                shareDocument={shareDocument}
                visualizePdf={visualizePdf}
                renameDocument={() => setRenameDocumentVisible(true)}
                deletePdf={alertDeletePdf}
                deleteDocument={alertDeleteCurrentDocument}
            />

            <FlashList
                data={documentModel?.pictures}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                extraData={[pictureSelection.isSelectionMode]}
                estimatedItemSize={estimatedItemSize}
                numColumns={columnCount}
                contentContainerStyle={{ padding: 4 }}
            />

            <RenameDocument
                visible={renameDocumentVisible}
                onRequestClose={() => setRenameDocumentVisible(false)}
            />

            <ConvertPdfOption
                visible={convertPdfOptionVisible}
                onRequestClose={() => setConvertPdfOptionVisible(false)}
                convertToPdf={convertDocumentToPdf}
            />
        </Screen>
    )
}

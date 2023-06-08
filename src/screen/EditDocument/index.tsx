import { Screen } from "@elementium/native"
import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useMemo, useState } from "react"
import { Alert, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { DocumentPicture, useDocumentModel } from "../../database"
import { useBackHandler, useSelectionMode } from "../../hooks"
import { translate } from "../../locales"
import { fullPathPdf, fullPathTemporaryCompressedPicture } from "../../services/constant"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { PdfCreator, PdfCreatorOptions } from "../../services/pdf-creator"
import { getReadPermission, getWritePermission } from "../../services/permission"
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

    async function convertDocumentToPdf(quality: number) {
        if (!documentModel)
            throw new Error("No documentModel, this should not happen")

        if (documentModel.pictures.length === 0) {
            log.warn("There is no pictures in the document to be converted to PDF")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_documentWithoutPictures_text")
            )
            return
        }

        const hasPermission = await getWritePermission()
        if (!hasPermission) {
            log.warn("Can not convert document to PDF because the permission was not granted")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noPermissionToConvertToPdf_text")
            )
            return
        }

        const documentPath = `${fullPathPdf}/${documentModel.name}.pdf`

        const pdfFileExists = await RNFS.exists(documentPath)
        if (pdfFileExists) {
            try {
                await RNFS.unlink(documentPath)
            } catch (error) {
                log.error(`Error deleting PDF file with the same name of the document to be converted: "${stringfyError(error)}"`)
            }
        }

        const pdfOptions: PdfCreatorOptions = {
            imageCompressQuality: quality,
            temporaryPath: fullPathTemporaryCompressedPicture,
        }

        const pictureList: string[] = documentModel.pictures.map(item => item.filePath)

        await createAllFolderAsync()
        PdfCreator.createPdf(pictureList, documentPath, pdfOptions)
    }

    async function shareDocument() {
        if (!documentModel)
            throw new Error("No documentModel, this should not happen")

        const documentPath = `file://${fullPathPdf}/${documentModel.name}.pdf`

        const pdfFileExists = await RNFS.exists(documentPath)
        if (!pdfFileExists) {
            log.warn("Can not shared PDF file because it doesn't exists")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_convertNotExistentPdfToShare_text")
            )
            return
        }

        try {
            await Share.open({
                title: translate("EditDocument_shareDocument"),
                type: "pdf/application",
                url: documentPath,
                failOnCancel: false
            })
        } catch (error) {
            log.error(`Error sharing PDF file: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorSharingPdf_text")
            )
        }
    }

    async function visualizePdf() {
        if (!documentModel)
            throw new Error("No documentModel, this should not happen")

        const hasPermission = await getReadPermission()
        if (!hasPermission) {
            log.warn("Can not visualize PDF because the permission was not granted")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noPermissionToVisualizePdf_text")
            )
            return
        }

        const pdfFilePath = `${fullPathPdf}/${documentModel.name}.pdf`

        const pdfFileExists = await RNFS.exists(pdfFilePath)
        if (!pdfFileExists) {
            log.warn("Can not visualize PDF because it doesn't exists")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_convertNotExistentPdfToVisualize_text")
            )
            return
        }

        PdfCreator.viewPdf(pdfFilePath)
    }

    async function deletePdf() {
        if (!documentModel)
            throw new Error("No documentModel, this should not happen")

        const hasPermission = await getWritePermission()
        if (!hasPermission) {
            log.warn("Can not delete PDF because the permission was not granted")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noPermissionToDeletePdf_text")
            )
            return
        }

        const pdfFilePath = `${fullPathPdf}/${documentModel.name}.pdf`

        const pdfFileExists = await RNFS.exists(pdfFilePath)
        if (!pdfFileExists) {
            log.warn("Can not delete PDF because it doesn't exists")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_pdfFileDoesNotExists_text")
            )
            return
        }

        try {
            await RNFS.unlink(pdfFilePath)
            Alert.alert(
                translate("success"),
                translate("EditDocument_alert_pdfFileDeletedSuccessfully_text")
            )
        } catch (error) {
            log.error(`Error deleting PDF file "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorDeletingPdfFile_text")
            )
        }
    }

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

    function invertSelection() {
        pictureSelection.setSelectedData(current => {
            const amountOfPictures = documentModel?.pictures.length ?? 0
            const newSelectedData: number[] = []
            for (let i = 0; i < amountOfPictures; i++) {
                if (!current.includes(i)) newSelectedData.push(i)
            }
            return newSelectedData
        })
    }

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

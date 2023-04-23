import { Screen } from "@elementium/native"
import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Alert, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { DocumentDatabase } from "../../database"
import { useBackHandler, useSelectionMode } from "../../hooks"
import { translate } from "../../locales"
import { fullPathPdf, fullPathTemporaryCompressedPicture } from "../../services/constant"
import { DocumentPicture, SimpleDocument } from "../../services/document"
import { useDocumentData } from "../../services/document-data"
import { deletePicturesService } from "../../services/document-service"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { PdfCreator, PdfCreatorOptions } from "../../services/pdf-creator"
import { getReadPermission, getWritePermission } from "../../services/permission"
import { NavigationParamProps, RouteParamProps } from "../../types"
import { ConvertPdfOption } from "./ConvertPdfOption"
import { EditDocumentHeader } from "./Header"
import { getPictureItemSize, HORIZONTAL_COLUMN_COUNT, PictureItem, VERTICAL_COLUMN_COUNT } from "./Pictureitem"
import { RenameDocument } from "./RenameDocument"


// TODO implement drag and drop to reorder list
// TODO implement split selected images to new document
export function EditDocument() {


    const navigation = useNavigation<NavigationParamProps<"EditDocument">>()
    const { params } = useRoute<RouteParamProps<"EditDocument">>()
    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    const { documentDataState, dispatchDocumentData } = useDocumentData()

    const columnCount = useMemo(() => (windowWidth < windowHeight)
        ? VERTICAL_COLUMN_COUNT
        : HORIZONTAL_COLUMN_COUNT
    , [windowWidth, windowHeight])
    const estimatedItemSize = useMemo(() => getPictureItemSize(windowWidth, columnCount), [windowWidth, columnCount])

    const pictureSelection = useSelectionMode<number>()
    const [renameDocumentVisible, setRenameDocumentVisible] = useState(false)
    const [convertPdfOptionVisible, setConvertPdfOptionVisible] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    async function loadDocument() {
        if (!params) {
            return
        }

        let document: SimpleDocument
        try {
            document = await DocumentDatabase.getDocument(params.documentId)
        } catch (error) {
            log.error(`Error getting document from database while opening: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorLoadingDocument_text")
            )
            return
        }

        let documentPicture: DocumentPicture[]
        try {
            documentPicture = await DocumentDatabase.getDocumentPicture(params.documentId)
        } catch (error) {
            log.error(`Error getting document picture from database while opening: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorLoadingDocumentPicture_text")
            )
            return
        }

        dispatchDocumentData({
            type: "set-document",
            payload: {
                document: {
                    id: params.documentId,
                    name: document.name,
                    lastModificationTimestamp: document.lastModificationTimestamp,
                },
                pictureList: documentPicture,
            }
        })
    }

    function goBack() {
        if (pictureSelection.isSelectionMode) {
            pictureSelection.exitSelection()
            return
        }

        dispatchDocumentData({ type: "save-and-close-document" })
        navigation.reset({ routes: [ { name: "Home" } ] })
    }

    async function convertDocumentToPdf(quality: number) {
        if (!documentDataState) {
            log.warn("Can not convert document to PDF because the document is empty")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_emptyDocument_text")
            )
            return
        }

        if (documentDataState.name === "") {
            log.warn("Can not convert document to PDF because the document name is empty")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_documentWithoutName_text")
            )
            return
        }

        if (documentDataState.pictureList.length === 0) {
            log.warn("Can not convert document to PDF because the document do not have any picture")
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

        const documentPath = `${fullPathPdf}/${documentDataState.name}.pdf`

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

        const pictureList: string[] = documentDataState.pictureList.map(item => item.filePath)

        await createAllFolderAsync()
        PdfCreator.createPdf(pictureList, documentPath, pdfOptions)
    }

    async function shareDocument() {
        if (!documentDataState) {
            log.warn("Can not share PDF file because the document is empty")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_emptyDocument_text")
            )
            return
        }

        const documentPath = `file://${fullPathPdf}/${documentDataState.name}.pdf`

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
        if (!documentDataState) {
            log.warn("Can not visualize PDF because the document is empty")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_emptyDocument_text")
            )
            return
        }

        const hasPermission = await getReadPermission()
        if (!hasPermission) {
            log.warn("Can not visualize PDF because the permission was not granted")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noPermissionToVisualizePdf_text")
            )
            return
        }

        const pdfFilePath = `${fullPathPdf}/${documentDataState.name}.pdf`

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
        if (!documentDataState) {
            log.warn("Can not delete PDF because the document is empty")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_emptyDocument_text")
            )
            return
        }

        const hasPermission = await getWritePermission()
        if (!hasPermission) {
            log.warn("Can not delete PDF because the permission was not granted")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noPermissionToDeletePdf_text")
            )
            return
        }

        const pdfFilePath = `${fullPathPdf}/${documentDataState.name}.pdf`

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
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("ok"), onPress: async () => await deletePdf() },
            ]
        )
    }

    async function deleteCurrentDocument() {
        if (!documentDataState) {
            navigation.reset({ routes: [ { name: "Home" } ] })
            return
        }

        if (!documentDataState.id) {
            dispatchDocumentData({ type: "close-document" })
            navigation.reset({ routes: [ { name: "Home" } ] })
            return
        }

        const picturePathsToDelete = documentDataState.pictureList.map(item => item.filePath)
        try {
            await DocumentDatabase.deleteDocument([documentDataState.id])
            deletePicturesService(picturePathsToDelete)
        } catch (error) {
            log.error(`Error deleting current document from database: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorDeletingCurrentDocument_text")
            )
        }
        dispatchDocumentData({ type: "close-document" })
        navigation.reset({ routes: [ { name: "Home" } ] })
    }

    function alertDeleteCurrentDocument() {
        Alert.alert(
            translate("EditDocument_alert_deleteDocument_title"),
            translate("EditDocument_alert_deleteDocument_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("ok"), onPress: async () => await deleteCurrentDocument() },
            ]
        )
    }

    function invertSelection() {
        if (!documentDataState) {
            return
        }

        const newSelectedData = []
        for (let i = 0; i < documentDataState.pictureList.length; i++) {
            if (!pictureSelection.selectedData.includes(i)) {
                newSelectedData.push(i)
            }
        }
        pictureSelection.setSelectedData(newSelectedData)
    }

    async function deleteSelectedPicture() {
        if (!documentDataState) {
            log.warn("Was not possible to delete selected pictures because document state is undefined")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_cantDeletePictureFromEmptyDocument_text")
            )
            return
        }

        const pictureIdToDelete = pictureSelection.selectedData
            .filter(pictureIndex => documentDataState.pictureList[pictureIndex].id !== undefined)
            .map(pictureIndex => documentDataState.pictureList[pictureIndex].id as number)

        const picturePathToDelete = pictureSelection.selectedData.map(pictureIndex =>
            documentDataState.pictureList[pictureIndex].filePath
        )

        try {
            await DocumentDatabase.deleteDocumentPicture(pictureIdToDelete)
            deletePicturesService(picturePathToDelete)
        } catch (error) {
            log.error(`Error deleting selected pictures from database: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorDeletingSelectedPictures_text")
            )
            pictureSelection.exitSelection()
            return
        }

        dispatchDocumentData({
            type: "remove-picture",
            payload: pictureSelection.selectedData,
        })
        pictureSelection.exitSelection()
    }

    function alertDeletePicture() {
        Alert.alert(
            translate("EditDocument_alert_deletePicture_title"),
            translate("EditDocument_alert_deletePicture_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("ok"), onPress: async () => await deleteSelectedPicture() },
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


    useEffect(() => {
        loadDocument()
    }, [])


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
                data={documentDataState?.pictureList}
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

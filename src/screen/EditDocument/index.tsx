import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Alert, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { Screen } from "../../components"
import { DocumentDatabase } from "../../database"
import { useBackHandler } from "../../hooks"
import { translate } from "../../locales"
import { fullPathPdf, fullPathTemporaryCompressedPicture } from "../../services/constant"
import { useDocumentData } from "../../services/document"
import { deletePicturesService } from "../../services/document-service"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { createPdf, PdfCreatorOptions, viewPdf } from "../../services/pdf-creator"
import { getReadPermission, getWritePermission } from "../../services/permission"
import { DocumentPicture, NavigationParamProps, RouteParamProps, SimpleDocument } from "../../types"
import { ConvertPdfOption } from "./ConvertPdfOption"
import { EditDocumentHeader } from "./Header"
import { getPictureItemSize, HORIZONTAL_COLUMN_COUNT, PictureItem, VERTICAL_COLUMN_COUNT } from "./Pictureitem"
import { RenameDocument } from "./RenameDocument"


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

    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedPictureIndex, setSelectedPictureIndex] = useState<number[]>([])
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

        let document: SimpleDocument | undefined = undefined
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

        let documentPicture: DocumentPicture[] | undefined = undefined
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
        if (isSelectionMode) {
            exitSelectionMode()
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
        createPdf(pictureList, documentPath, pdfOptions)
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

        viewPdf(pdfFilePath)
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

    async function deleteSelectedPicture() {
        if (!documentDataState) {
            log.warn("Was not possible to delete selected pictures because document state is undefined")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_cantDeletePictureFromEmptyDocument_text")
            )
            return
        }

        const pictureIdToDelete = selectedPictureIndex
            .filter(pictureIndex => documentDataState.pictureList[pictureIndex].id !== undefined)
            .map(pictureIndex => documentDataState.pictureList[pictureIndex].id as number)

        const picturePathToDelete = selectedPictureIndex.map(pictureIndex =>
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
            exitSelectionMode()
            return
        }

        dispatchDocumentData({
            type: "remove-picture",
            payload: selectedPictureIndex,
        })
        exitSelectionMode()
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

    function selectPicture(pictureIndex: number) {
        if (!isSelectionMode) {
            setIsSelectionMode(true)
        }
        if (!selectedPictureIndex.includes(pictureIndex)) {
            setSelectedPictureIndex(currentSelectedPictureIndex => [...currentSelectedPictureIndex, pictureIndex])
        }
    }

    function deselectPicture(pictureIndex: number) {
        const index = selectedPictureIndex.indexOf(pictureIndex)
        if (index !== -1) {
            const newSelectedPictureIndex = [...selectedPictureIndex]
            newSelectedPictureIndex.splice(index, 1)
            setSelectedPictureIndex(newSelectedPictureIndex)

            if (isSelectionMode && newSelectedPictureIndex.length === 0) {
                setIsSelectionMode(false)
            }
        }
    }

    function exitSelectionMode() {
        setSelectedPictureIndex([])
        setIsSelectionMode(false)
    }

    function renderItem({ item, index }: { item: DocumentPicture, index: number }) {
        return (
            <PictureItem
                onClick={() => navigation.navigate("VisualizePicture", { pictureIndex: index })}
                onSelected={() => selectPicture(index)}
                onDeselected={() => deselectPicture(index)}
                isSelectionMode={isSelectionMode}
                isSelected={selectedPictureIndex.includes(index)}
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
                exitSelectionMode={exitSelectionMode}
                isSelectionMode={isSelectionMode}
                selectedPicturesAmount={selectedPictureIndex.length}
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
                extraData={[isSelectionMode]}
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

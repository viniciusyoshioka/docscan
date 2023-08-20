import { AnimatedHeaderRef, Screen } from "@elementium/native"
import { useNavigation } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useMemo, useRef, useState } from "react"
import { Alert, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { LoadingModal } from "@components"
import { DocumentPictureSchema, DocumentSchema, useDocumentModel, useDocumentRealm } from "@database"
import { useBackHandler, useHeaderColorOnScroll, useSelectionMode } from "@hooks"
import { translate } from "@locales"
import { NavigationParamProps } from "@router"
import { DocumentService } from "@services/document"
import { log, stringfyError } from "@services/log"
import { PdfCreator } from "@services/pdf-creator"
import { getReadPermission, getWritePermission } from "@services/permission"
import { EditDocumentHeader } from "./Header"
import { HORIZONTAL_COLUMN_COUNT, PictureItem, VERTICAL_COLUMN_COUNT, getPictureItemSize } from "./Pictureitem"


export { ConvertPdfOption } from "./ConvertPdfOption"
export { RenameDocument } from "./RenameDocument"


// TODO implement drag and drop to reorder list
// TODO implement split selected images to new document
export function EditDocument() {


    const navigation = useNavigation<NavigationParamProps<"EditDocument">>()

    const editDocumentHeaderRef = useRef<AnimatedHeaderRef>(null)

    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    const { documentModel, setDocumentModel } = useDocumentModel()
    const documentRealm = useDocumentRealm()
    const document = documentModel?.document ?? undefined
    const pictures = useMemo(() => (document
        ? documentRealm.objects(DocumentPictureSchema)
            .filtered("belongsToDocument = $0", document.id)
            .sorted("position")
        : []
    ), [document])

    const columnCount = useMemo(() => (windowWidth < windowHeight)
        ? VERTICAL_COLUMN_COUNT
        : HORIZONTAL_COLUMN_COUNT
    , [windowWidth, windowHeight])
    const estimatedItemSize = useMemo(() => getPictureItemSize(windowWidth, columnCount), [windowWidth, columnCount])

    const pictureSelection = useSelectionMode<number>()
    const [isDeletingPictures, setIsDeletingPictures] = useState(false)
    const [isDeletingDocument, setIsDeletingDocument] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    const onScroll = useHeaderColorOnScroll({
        onInterpolate: color => editDocumentHeaderRef.current?.setBackgroundColor(color),
    })


    function goBack() {
        if (pictureSelection.isSelectionMode) {
            pictureSelection.exitSelection()
            return
        }

        setDocumentModel(undefined)
        navigation.goBack()
    }

    async function shareDocument() {
        if (!document) {
            log.warn("There is no document to be shared")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noDocumentOpened_text")
            )
            return
        }

        const documentPath = DocumentService.getPdfPath(document.name)

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
                url: `file://${documentPath}`,
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
        if (!document) {
            log.warn("There is no document to visualize the PDF")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noDocumentOpened_text")
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

        const pdfFilePath = DocumentService.getPdfPath(document.name)

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
        if (!document) throw new Error("There is no document to delete the PDF, this should not happen")

        const hasPermission = await getWritePermission()
        if (!hasPermission) {
            log.warn("Can not delete PDF because the permission was not granted")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noPermissionToDeletePdf_text")
            )
            return
        }

        const pdfFilePath = DocumentService.getPdfPath(document.name)

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
        if (!document) {
            log.warn("There is no document to delete the PDF")
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_noDocumentOpened_text")
            )
            return
        }

        Alert.alert(
            translate("EditDocument_alert_deletePdf_title"),
            translate("EditDocument_alert_deletePdf_text"),
            [
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("ok"), onPress: deletePdf },
            ]
        )
    }

    async function deleteCurrentDocument() {
        if (!document) throw new Error("No document to be deleted, this should not happen")

        setIsDeletingDocument(true)

        const picturePathsToDelete = pictures.map(item => DocumentService.getPicturePath(item.fileName))

        try {
            documentRealm.beginTransaction()
            documentRealm.delete(pictures)
            documentRealm.delete(document)
            documentRealm.commitTransaction()

            setDocumentModel(undefined)

            DocumentService.deletePicturesService({ pictures: picturePathsToDelete })
        } catch (error) {
            log.error(`Error deleting current document from database: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorDeletingCurrentDocument_text")
            )
        }

        setIsDeletingDocument(false)
        navigation.reset({ routes: [ { name: "Home" } ] })
    }

    function alertDeleteCurrentDocument() {
        if (!document) {
            goBack()
            return
        }

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
            const newSelectedData: number[] = []
            for (let i = 0; i < pictures.length; i++) {
                if (!current.includes(i)) newSelectedData.push(i)
            }
            return newSelectedData
        })
    }

    async function deleteSelectedPicture() {
        if (!document) throw new Error("There is no document to delete its pictures, this should not happen")

        setIsDeletingPictures(true)

        const picturePathsToDelete = pictureSelection.selectedData.map(index =>
            DocumentService.getPicturePath(pictures[index].fileName)
        )

        try {
            documentRealm.write(() => {
                documentRealm.delete(pictures.filter((_, index) => pictureSelection.selectedData.includes(index)))
                document.modifiedAt = Date.now()
            })

            const updatedDocument = documentRealm.objectForPrimaryKey(DocumentSchema, document.id)
            const updatedPictures = documentRealm
                .objects(DocumentPictureSchema)
                .filtered("belongsToDocument = $0", document.id)
                .sorted("position")
            if (!updatedDocument) throw new Error("Document is undefined, this should not happen")
            setDocumentModel({ document: updatedDocument, pictures: updatedPictures })

            DocumentService.deletePicturesService({ pictures: picturePathsToDelete })
        } catch (error) {
            log.error(`Error deleting selected pictures from database: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("EditDocument_alert_errorDeletingSelectedPictures_text")
            )
        }

        pictureSelection.exitSelection()
        setIsDeletingPictures(false)
    }

    function alertDeletePicture() {
        if (!document) throw new Error("There is no document to delete its pictures, this should not happen")

        Alert.alert(
            translate("EditDocument_alert_deletePicture_title"),
            translate("EditDocument_alert_deletePicture_text"),
            [
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("ok"), onPress: deleteSelectedPicture },
            ]
        )
    }

    function renderItem({ item, index }: { item: DocumentPictureSchema, index: number }) {
        return (
            <PictureItem
                onClick={() => navigation.navigate("VisualizePicture", { pictureIndex: index })}
                onSelect={() => pictureSelection.selectItem(index)}
                onDeselect={() => pictureSelection.deselectItem(index)}
                isSelectionMode={pictureSelection.isSelectionMode}
                isSelected={pictureSelection.selectedData.includes(index)}
                picturePath={DocumentService.getPicturePath(item.fileName)}
                columnCount={columnCount}
            />
        )
    }

    const keyExtractor = useCallback((_: DocumentPictureSchema, index: number) => index.toString(), [])


    return (
        <Screen>
            <EditDocumentHeader
                ref={editDocumentHeaderRef}
                goBack={goBack}
                exitSelectionMode={pictureSelection.exitSelection}
                isSelectionMode={pictureSelection.isSelectionMode}
                selectedPicturesAmount={pictureSelection.selectedData.length}
                invertSelection={invertSelection}
                deletePicture={alertDeletePicture}
                openCamera={() => navigation.navigate("Camera", { screenAction: "add-picture" })}
                shareDocument={shareDocument}
                visualizePdf={visualizePdf}
                deletePdf={alertDeletePdf}
                deleteDocument={alertDeleteCurrentDocument}
            />

            <FlashList
                data={pictures}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                extraData={[pictureSelection.isSelectionMode]}
                estimatedItemSize={estimatedItemSize}
                numColumns={columnCount}
                contentContainerStyle={{ padding: 4 }}
                onScroll={onScroll}
            />

            <LoadingModal
                message={translate("EditDocument_deletingPictures")}
                visible={isDeletingPictures}
            />

            <LoadingModal
                message={translate("EditDocument_deletingDocument")}
                visible={isDeletingDocument}
            />
        </Screen>
    )
}

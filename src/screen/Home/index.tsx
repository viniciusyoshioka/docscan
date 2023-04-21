import { Divider, Screen } from "@elementium/native"
import { useNavigation } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useEffect, useState } from "react"
import { Alert, View } from "react-native"
import DocumentPicker from "react-native-document-picker"

import { EmptyList, LoadingModal } from "../../components"
import { DocumentDatabase } from "../../database"
import { useBackHandler, useSelectionMode } from "../../hooks"
import { translate, TranslationKeyType } from "../../locales"
import { appIconOutline } from "../../services/constant"
import { deletePicturesService } from "../../services/document-service"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { DocumentForList, NavigationParamProps } from "../../types"
import { DocumentItem, DOCUMENT_ITEM_HEIGHT } from "./DocumentItem"
import { HomeHeader } from "./Header"


// TODO add comunication with background service to alert when export is done
// TODO add comunication with background service to alert when import is done
export function Home() {


    const navigation = useNavigation<NavigationParamProps<"Home">>()

    const [documents, setDocuments] = useState<DocumentForList[]>([])
    const documentSelection = useSelectionMode<number>()
    const [showDocumentDeletionModal, setShowDocumentDeletionModal] = useState(false)


    useBackHandler(() => {
        if (documentSelection.isSelectionMode) {
            documentSelection.exitSelection()
            return true
        }
        return false
    })


    async function getDocumentList() {
        try {
            const documentList = await DocumentDatabase.getDocumentList()
            setDocuments(documentList)
        } catch (error) {
            log.error(`Error getting document list from database: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Home_alert_errorLoadingDocuments_text")
            )
        }
    }

    function invertSelection() {
        documentSelection.setSelectedData(current => documents
            .filter(documentItem => !current.includes(documentItem.id))
            .map(documentItem => documentItem.id)
        )
    }

    async function deleteSelectedDocument() {
        setShowDocumentDeletionModal(true)

        const selectedDocumentsIdCopy = [...documentSelection.selectedData]
        documentSelection.exitSelection()

        try {
            const picturesToDelete = await DocumentDatabase.getPicturePathFromDocument(selectedDocumentsIdCopy)
            await DocumentDatabase.deleteDocument(selectedDocumentsIdCopy)
            deletePicturesService(picturesToDelete)
            await getDocumentList()
            setShowDocumentDeletionModal(false)
        } catch (error) {
            log.error(`Error deleting selected documents from database: "${stringfyError(error)}"`)
            setShowDocumentDeletionModal(false)
            Alert.alert(
                translate("warn"),
                translate("Home_alert_errorDeletingSelectedDocuments_text")
            )
        }
    }

    function alertDeleteDocument() {
        Alert.alert(
            translate("Home_alert_deleteDocuments_title"),
            translate("Home_alert_deleteDocuments_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("delete"), onPress: async () => await deleteSelectedDocument() }
            ]
        )
    }

    async function importDocument() {
        let pickedFile
        try {
            pickedFile = await DocumentPicker.pickSingle({
                copyTo: "cachesDirectory",
                type: DocumentPicker.types.zip
            })
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                return
            }

            log.error(`Error picking file to import document: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Home_alert_errorImportingDocuments_text")
            )
            return
        }

        if (pickedFile.copyError || !pickedFile.fileCopyUri) {
            log.error(`Error copying picked file to import document: "${stringfyError(pickedFile.copyError)}"`)
            Alert.alert(
                translate("warn"),
                translate("Home_alert_errorImportingDocuments_text")
            )
            return
        }

        Alert.alert(
            translate("Home_alert_importDocuments_title"),
            translate("Home_alert_importDocuments_text")
        )

        await createAllFolderAsync()
        const fileUri = pickedFile.fileCopyUri.replace(/%20/g, " ")
        DocumentDatabase.importDocument(fileUri)
            .catch(error => {
                log.error(`Error importing document: "${stringfyError(error)}"`)
                Alert.alert(
                    translate("warn"),
                    translate("Home_alert_errorImportingDocuments_text")
                )
            })
    }

    async function exportSelectedDocument() {
        Alert.alert(
            translate("Home_alert_exportingDocuments_title"),
            translate("Home_alert_exportingDocuments_text")
        )

        await createAllFolderAsync()
        DocumentDatabase.exportDocument(documentSelection.selectedData)
            .catch(error => {
                log.error(`Error exporting documents before invoking the background service: "${stringfyError(error)}"`)
                Alert.alert(
                    translate("warn"),
                    translate("Home_alert_errorExportingDocuments_text")
                )
            })
        documentSelection.exitSelection()
    }

    function alertExportDocument() {
        if (documents.length === 0) {
            Alert.alert(
                translate("warn"),
                translate("Home_alert_noDocumentsToExport_text")
            )
            return
        }

        const exportAlertText: TranslationKeyType = documentSelection.isSelectionMode
            ? "Home_alert_allSelectedDocumentsWillBeExported_text"
            : "Home_alert_allDocumentsWillBeExported_text"

        Alert.alert(
            translate("Home_alert_exportDocuments_title"),
            translate(exportAlertText),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("Home_export"), onPress: async () => await exportSelectedDocument() }
            ]
        )
    }

    // TODO merge selected documents
    async function mergeSelectedDocument() {
        documentSelection.exitSelection()
    }

    function alertMergeDocument() {
        Alert.alert(
            translate("Home_alert_mergeDocuments_title"),
            translate("Home_alert_mergeDocuments_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("Home_merge"), onPress: async () => await mergeSelectedDocument() }
            ]
        )
    }

    // TODO duplicate selected documents
    async function duplicateSelectedDocument() {
        documentSelection.exitSelection()
    }

    function alertDuplicateDocument() {
        Alert.alert(
            translate("Home_alert_duplicateDocuments_title"),
            translate("Home_alert_duplicateDocuments_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("Home_duplicate"), onPress: async () => await duplicateSelectedDocument() }
            ]
        )
    }

    function renderItem({ item }: { item: DocumentForList }) {
        return (
            <DocumentItem
                onClick={() => navigation.navigate("EditDocument", { documentId: item.id })}
                onSelect={() => documentSelection.selectItem(item.id)}
                onDeselect={() => documentSelection.deselectItem(item.id)}
                isSelectionMode={documentSelection.isSelectionMode}
                isSelected={documentSelection.selectedData.includes(item.id)}
                document={item}
            />
        )
    }


    useEffect(() => {
        getDocumentList()
    }, [])


    return (
        <Screen>
            <HomeHeader
                isSelectionMode={documentSelection.isSelectionMode}
                selectedDocumentsAmount={documentSelection.selectedData.length}
                exitSelectionMode={documentSelection.exitSelection}
                invertSelection={invertSelection}
                deleteSelectedDocuments={alertDeleteDocument}
                scanNewDocument={() => navigation.navigate("Camera")}
                importDocument={importDocument}
                exportDocument={alertExportDocument}
                openSettings={() => navigation.navigate("Settings")}
                mergeDocument={alertMergeDocument}
                duplicateDocument={alertDuplicateDocument}
            />

            <View style={{ display: documents.length ? "flex" : "none", flex: 1 }}>
                <FlashList
                    data={documents}
                    renderItem={renderItem}
                    extraData={documentSelection.selectedData}
                    estimatedItemSize={DOCUMENT_ITEM_HEIGHT}
                    ItemSeparatorComponent={() => <Divider wrapperStyle={{ paddingHorizontal: 16 }} />}
                />
            </View>

            <EmptyList
                imageSource={appIconOutline}
                message={translate("Home_emptyDocumentList")}
                visible={documents.length === 0}
            />

            <LoadingModal
                visible={showDocumentDeletionModal}
                message={translate("Home_deletingDocuments")}
            />
        </Screen>
    )
}

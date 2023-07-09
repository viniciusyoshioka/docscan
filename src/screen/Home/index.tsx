import { Divider, Screen } from "@elementium/native"
import { useNavigation } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { useState } from "react"
import { Alert, View } from "react-native"

import { EmptyList, LoadingModal } from "../../components"
import { DocumentPictureSchema, DocumentSchema, useDocumentModel, useDocumentRealm } from "../../database"
import { useBackHandler, useSelectionMode } from "../../hooks"
import { TranslationKeyType, translate } from "../../locales"
import { appIconOutline } from "../../services/constant"
import { DocumentService } from "../../services/document"
import { log, stringfyError } from "../../services/log"
import { NavigationParamProps } from "../../types"
import { DOCUMENT_ITEM_HEIGHT, DocumentItem } from "./DocumentItem"
import { HomeHeader } from "./Header"


// TODO add comunication with background service to alert when export is done
// TODO add comunication with background service to alert when import is done
export function Home() {


    const navigation = useNavigation<NavigationParamProps<"Home">>()

    const { setDocumentModel } = useDocumentModel()
    const documentRealm = useDocumentRealm()
    const documents = documentRealm.objects(DocumentSchema).sorted("modifiedAt", true)
    const documentSelection = useSelectionMode<string>()
    const [showDocumentDeletionModal, setShowDocumentDeletionModal] = useState(false)


    useBackHandler(() => {
        if (documentSelection.isSelectionMode) {
            documentSelection.exitSelection()
            return true
        }
        return false
    })


    function invertSelection() {
        documentSelection.setSelectedData(current => documents
            .filter(documentItem => !current.includes(documentItem.id.toHexString()))
            .map(documentItem => documentItem.id.toHexString())
        )
    }

    async function deleteSelectedDocument() {
        setShowDocumentDeletionModal(true)

        try {
            const documentIdToDelete = documentSelection
                .selectedData
                .map(documentId => Realm.BSON.ObjectId.createFromHexString(documentId))

            const picturesToDelete = documentRealm
                .objects(DocumentPictureSchema)
                .filtered("belongsToDocument IN $0", documentIdToDelete)

            const documentsToDelete = documentRealm
                .objects(DocumentSchema)
                .filtered("id IN $0", documentIdToDelete)

            documentRealm.beginTransaction()
            documentRealm.delete(picturesToDelete)
            documentRealm.delete(documentsToDelete)
            documentRealm.commitTransaction()

            const picturesPathToDelete = picturesToDelete.map(picture =>
                DocumentService.getPicturePath(picture.fileName)
            )
            DocumentService.deletePicturesService(picturesPathToDelete)
        } catch (error) {
            if (documentRealm.isInTransaction) {
                documentRealm.cancelTransaction()
            }

            log.error(`Error deleting selected documents from database: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Home_alert_errorDeletingSelectedDocuments_text")
            )
        } finally {
            documentSelection.exitSelection()
            setShowDocumentDeletionModal(false)
        }
    }

    function alertDeleteDocument() {
        Alert.alert(
            translate("Home_alert_deleteDocuments_title"),
            translate("Home_alert_deleteDocuments_text"),
            [
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("delete"), onPress: deleteSelectedDocument }
            ]
        )
    }

    // TODO reimplement importDocument
    async function importDocument() {}

    // TODO reimplement exportSelectedDocument
    async function exportSelectedDocument() {}

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
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("Home_export"), onPress: exportSelectedDocument }
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
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("Home_merge"), onPress: mergeSelectedDocument }
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
                { text: translate("cancel"), onPress: () => {} },
                { text: translate("Home_duplicate"), onPress: duplicateSelectedDocument }
            ]
        )
    }

    function renderItem({ item }: { item: DocumentSchema }) {
        const documentId = item.id.toHexString()

        return (
            <DocumentItem
                onClick={() => {
                    const pictures = documentRealm
                        .objects(DocumentPictureSchema)
                        .filtered("belongsToDocument = $0", item.id)
                        .sorted("position")
                    setDocumentModel({ document: item, pictures })
                    navigation.navigate("EditDocument")
                }}
                onSelect={() => documentSelection.selectItem(documentId)}
                onDeselect={() => documentSelection.deselectItem(documentId)}
                isSelectionMode={documentSelection.isSelectionMode}
                isSelected={documentSelection.selectedData.includes(documentId)}
                document={item}
            />
        )
    }


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

import { useNavigation } from "@react-navigation/core"
import { useCallback, useEffect, useState } from "react"
import { Alert, FlatList } from "react-native"

import { EmptyList, LoadingModal, Screen } from "../../components"
import { DocumentDatabase } from "../../database"
import { useBackHandler } from "../../hooks"
import { translate } from "../../locales"
import { appIconOutline } from "../../services/constant"
import { deletePicturesService } from "../../services/document-service"
import { createAllFolderAsync } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { DocumentForList, NavigationParamProps, TranslationKeyType } from "../../types"
import { DocumentItem } from "./DocumentItem"
import { HomeHeader } from "./Header"


export function Home() {


    const navigation = useNavigation<NavigationParamProps<"Home">>()

    const [documents, setDocuments] = useState<DocumentForList[]>([])
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedDocumentsId, setSelectedDocumentsId] = useState<number[]>([])
    const [showDocumentDeletionModal, setShowDocumentDeletionModal] = useState(false)


    useBackHandler(() => {
        if (isSelectionMode) {
            exitSelectionMode()
            return true
        }
    })


    async function getDocumentList() {
        try {
            const documentList = await DocumentDatabase.getDocumentList()
            setDocuments(documentList)
        } catch (error) {
            log.error(`Error getting document list from database: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("home_alert_errorLoadingDocuments_text")
            )
        }
    }

    function invertSelection() {
        setSelectedDocumentsId(current => documents
            .filter(documentItem => !current.includes(documentItem.id))
            .map(documentItem => documentItem.id)
        )
    }

    async function deleteSelectedDocument() {
        setShowDocumentDeletionModal(true)

        const selectedDocumentsIdCopy = [...selectedDocumentsId]
        exitSelectionMode()

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
                translate("home_alert_errorDeletingSelectedDocuments_text")
            )
        }
    }

    function alertDeleteDocument() {
        Alert.alert(
            translate("home_alert_deleteDocuments_title"),
            translate("home_alert_deleteDocuments_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("delete"), onPress: async () => await deleteSelectedDocument() }
            ]
        )
    }

    async function exportSelectedDocument() {
        Alert.alert(
            translate("home_alert_exportingDocuments_title"),
            translate("home_alert_exportingDocuments_text")
        )

        await createAllFolderAsync()
        DocumentDatabase.exportDocument(selectedDocumentsId)
            .catch(error => {
                log.error(`Error exporting documents before invoking the background service: "${stringfyError(error)}"`)
                Alert.alert(
                    translate("warn"),
                    translate("home_alert_errorExportingDocuments_text")
                )
            })
        exitSelectionMode()
    }

    function alertExportDocument() {
        if (documents.length === 0) {
            Alert.alert(
                translate("warn"),
                translate("home_alert_noDocumentsToExport_text")
            )
            return
        }

        const exportAlertText: TranslationKeyType = isSelectionMode
            ? "home_alert_allSelectedDocumentsWillBeExported_text"
            : "home_alert_allDocumentsWillBeExported_text"

        Alert.alert(
            translate("home_alert_exportDocuments_title"),
            translate(exportAlertText),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("home_export"), onPress: async () => await exportSelectedDocument() }
            ]
        )
    }

    // TODO
    async function mergeSelectedDocument() {
        exitSelectionMode()
    }

    function alertMergeDocument() {
        Alert.alert(
            translate("home_alert_mergeDocuments_title"),
            translate("home_alert_mergeDocuments_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("home_merge"), onPress: async () => await mergeSelectedDocument() }
            ]
        )
    }

    // TODO
    async function duplicateSelectedDocument() {
        exitSelectionMode()
    }

    function alertDuplicateDocument() {
        Alert.alert(
            translate("home_alert_duplicateDocuments_title"),
            translate("home_alert_duplicateDocuments_text"),
            [
                { text: translate("cancel"), onPress: () => { } },
                { text: translate("home_duplicate"), onPress: async () => await duplicateSelectedDocument() }
            ]
        )
    }

    function selectDocument(documentId: number) {
        if (!isSelectionMode) {
            setIsSelectionMode(true)
        }
        if (!selectedDocumentsId.includes(documentId)) {
            setSelectedDocumentsId(currentSelectedDocument => [...currentSelectedDocument, documentId])
        }
    }

    function deselectDocument(documentId: number) {
        const index = selectedDocumentsId.indexOf(documentId)
        if (index !== -1) {
            const newSelectedDocument = [...selectedDocumentsId]
            newSelectedDocument.splice(index, 1)
            setSelectedDocumentsId(newSelectedDocument)

            if (isSelectionMode && newSelectedDocument.length === 0) {
                setIsSelectionMode(false)
            }
        }
    }

    function exitSelectionMode() {
        setSelectedDocumentsId([])
        setIsSelectionMode(false)
    }

    function renderItem({ item }: { item: DocumentForList }) {
        return (
            <DocumentItem
                onClick={() => navigation.navigate("EditDocument", { documentId: item.id })}
                onSelected={() => selectDocument(item.id)}
                onDeselected={() => deselectDocument(item.id)}
                isSelectionMode={isSelectionMode}
                isSelected={selectedDocumentsId.includes(item.id)}
                document={item}
            />
        )
    }

    const keyExtractor = useCallback((item: DocumentForList) => item.id.toString(), [])


    useEffect(() => {
        getDocumentList()
    }, [])


    return (
        <Screen>
            <HomeHeader
                isSelectionMode={isSelectionMode}
                selectedDocumentsAmount={selectedDocumentsId.length}
                exitSelectionMode={exitSelectionMode}
                invertSelection={invertSelection}
                deleteSelectedDocuments={alertDeleteDocument}
                scanNewDocument={() => navigation.navigate("Camera")}
                importDocument={() => navigation.navigate("FileExplorer")}
                exportDocument={alertExportDocument}
                openSettings={() => navigation.navigate("Settings")}
                mergeDocument={alertMergeDocument}
                duplicateDocument={alertDuplicateDocument}
            />

            <FlatList
                data={documents}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                style={{ display: documents.length ? "flex" : "none" }}
                contentContainerStyle={{ paddingTop: documents.length ? 8 : 0 }}
            />

            <EmptyList
                imageSource={appIconOutline}
                message={translate("home_emptyDocumentList")}
                visible={documents.length === 0}
            />

            <LoadingModal
                visible={showDocumentDeletionModal}
                message={translate("home_deletingDocuments")}
            />
        </Screen>
    )
}

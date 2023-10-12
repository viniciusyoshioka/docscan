import { Screen } from "@elementium/native"
import { useNavigation } from "@react-navigation/native"
import { Realm } from "@realm/react"
import { FlashList } from "@shopify/flash-list"
import { useEffect, useState } from "react"
import { Alert } from "react-native"
import DocumentPicker from "react-native-document-picker"
import RNFS from "react-native-fs"
import { Divider, FAB } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { unzip } from "react-native-zip-archive"

import { EmptyList, LoadingModal } from "@components"
import { DocumentPictureSchema, DocumentSchema, ExportedDocumentPictureRealm, ExportedDocumentRealm, openExportedDatabase, useDocumentModel, useDocumentRealm } from "@database"
import { useBackHandler, useSelectionMode } from "@hooks"
import { TranslationKeyType, translate } from "@locales"
import { NavigationParamProps } from "@router"
import { Constants } from "@services/constant"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { log, stringfyError } from "@services/log"
import { getNotificationPermission } from "@services/permission"
import { DOCUMENT_ITEM_HEIGHT, DocumentItem } from "./DocumentItem"
import { HomeHeader } from "./Header"
import { useDocuments } from "./useDocuments"


// TODO improve database operations in deleteSelectedDocument
// TODO improve database operations in importDocument
// TODO improve database operations in exportSelectedDocument
// TODO add comunication with background service to alert when export is done
// TODO add comunication with background service to alert when import is done
export function Home() {


    const safeAreaInsets = useSafeAreaInsets()
    const navigation = useNavigation<NavigationParamProps<"Home">>()

    const { setDocumentModel } = useDocumentModel()
    const documentRealm = useDocumentRealm()
    const documents = useDocuments()
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
            DocumentService.deletePicturesService({ pictures: picturesPathToDelete })
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

    async function importDocument() {
        try {
            const pickedFile = await DocumentPicker.pickSingle({
                copyTo: "cachesDirectory",
                type: DocumentPicker.types.zip,
            })

            if (pickedFile.copyError)
                throw new Error(`Error copying picked file to import document: "${stringfyError(pickedFile.copyError)}"`)
            if (!pickedFile.fileCopyUri)
                throw new Error("Copying document to import did not returned a valid path")

            Alert.alert(
                translate("Home_alert_importDocuments_title"),
                translate("Home_alert_importDocuments_text")
            )
            await createAllFolders()

            const fileUri = pickedFile.fileCopyUri.replaceAll("%20", " ").replace("file://", "")
            await unzip(fileUri, Constants.fullPathTemporaryImported)
            await RNFS.unlink(fileUri)

            const pictureToMove: string[] = []
            const exportedDatabase = await openExportedDatabase(Constants.importDatabaseFullPath)
            const exportedDocuments = exportedDatabase.objects<ExportedDocumentRealm>("ExportedDocumentSchema").sorted("modifiedAt")

            documentRealm.beginTransaction()
            for (let i = 0; i < exportedDocuments.length; i++) {
                const exportedDocument = exportedDocuments[i]
                const importedDocument = documentRealm.create(DocumentSchema, {
                    createdAt: exportedDocument.createdAt,
                    modifiedAt: Date.now(),
                    name: exportedDocument.name,
                })

                const exportedPictures = exportedDatabase
                    .objects<ExportedDocumentPictureRealm>("ExportedDocumentPictureSchema")
                    .filtered("belongsToDocument = $0", exportedDocument.id)
                for (let j = 0; j < exportedPictures.length; j++) {
                    const exportedPicture = exportedPictures[j]
                    const newPicturePath = await DocumentService.getNewPicturePath(exportedPicture.fileName)
                    const newPictureName = DocumentService.getFileFullname(newPicturePath)

                    documentRealm.create(DocumentPictureSchema, {
                        fileName: newPictureName,
                        position: exportedPicture.position,
                        belongsToDocument: importedDocument.id,
                    })

                    pictureToMove.push(DocumentService.getTemporaryImportedPicturePath(exportedPicture.fileName))
                    pictureToMove.push(newPicturePath)
                }
            }
            documentRealm.commitTransaction()

            exportedDatabase.close()
            await RNFS.unlink(Constants.importDatabaseFullPath)

            documentSelection.exitSelection()

            DocumentService.movePicturesService({ pictures: pictureToMove })
        } catch (error) {
            if (DocumentPicker.isCancel(error)) return

            if (documentRealm.isInTransaction) {
                documentRealm.cancelTransaction()
            }

            try {
                if (await RNFS.exists(Constants.fullPathTemporaryImported)) {
                    await RNFS.unlink(Constants.fullPathTemporaryImported)
                }
            } catch (error) {
                log.error(`Error deleting temporary imported files after error in document import: "${stringfyError(error)}"`)
            }

            log.error(`Error importing document: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Home_alert_errorImportingDocuments_text")
            )
        }
    }

    async function exportSelectedDocument() {
        Alert.alert(
            translate("Home_alert_exportingDocuments_title"),
            translate("Home_alert_exportingDocuments_text")
        )

        await createAllFolders()
        try {
            const exportedDatabase = await openExportedDatabase(Constants.exportDatabaseFullPath)

            const selectedDocumentsObjectId = documentSelection
                .selectedData
                .map(Realm.BSON.ObjectId.createFromHexString)
            const documentsToExport = documentSelection.isSelectionMode
                ? documents.filtered("id IN $0", selectedDocumentsObjectId)
                : documents

            const filesToCopy: string[] = []

            exportedDatabase.write(() => {
                documentsToExport.forEach(documentToExport => {
                    const exportedDocument = exportedDatabase.create<ExportedDocumentRealm>("ExportedDocumentSchema", {
                        createdAt: documentToExport.createdAt,
                        modifiedAt: documentToExport.modifiedAt,
                        name: documentToExport.name,
                    })

                    documentRealm
                        .objects(DocumentPictureSchema)
                        .filtered("belongsToDocument = $0", documentToExport.id)
                        .forEach(pictureToExport => {
                            filesToCopy.push(DocumentService.getPicturePath(pictureToExport.fileName))

                            exportedDatabase.create<ExportedDocumentPictureRealm>("ExportedDocumentPictureSchema", {
                                fileName: pictureToExport.fileName,
                                position: pictureToExport.position,
                                belongsToDocument: exportedDocument.id,
                            })
                        })
                })
            })

            exportedDatabase.close()

            DocumentService.exportDocumentService({
                pictures: filesToCopy,
                databasePath: Constants.exportDatabaseFullPath,
                pathZipTo: DocumentService.getTemporaryExportedDocumentPath(),
                pathExportedDocument: DocumentService.getExportedDocumentPath(),
            })
        } catch (error) {
            log.error(`Error exporting documents before invoking the background service: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Home_alert_errorExportingDocuments_text")
            )
        }

        if (documentSelection.isSelectionMode) {
            documentSelection.exitSelection()
        }
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


    useEffect(() => {
        async function requestPermissions() {
            const hasPermission = await getNotificationPermission()
            if (!hasPermission) {
                Alert.alert(
                    translate("Home_alert_notificationPermissionDenied_title"),
                    translate("Home_alert_notificationPermissionDenied_text")
                )
            }
        }

        requestPermissions()
    }, [])


    return (
        <Screen>
            <HomeHeader
                isSelectionMode={documentSelection.isSelectionMode}
                selectedDocumentsAmount={documentSelection.selectedData.length}
                exitSelectionMode={documentSelection.exitSelection}
                invertSelection={invertSelection}
                deleteSelectedDocuments={alertDeleteDocument}
                importDocument={importDocument}
                exportDocument={alertExportDocument}
                mergeDocument={alertMergeDocument}
                duplicateDocument={alertDuplicateDocument}
            />

            {documents.length > 0 && (
                <FlashList
                    data={documents.toJSON() as unknown as DocumentSchema[]}
                    renderItem={renderItem}
                    extraData={documentSelection.selectedData}
                    estimatedItemSize={DOCUMENT_ITEM_HEIGHT}
                    ItemSeparatorComponent={() => <Divider style={{ marginHorizontal: 16 }} />}
                    contentContainerStyle={{ paddingBottom: (16 * 2) + 56 + safeAreaInsets.bottom }}
                />
            )}

            <EmptyList
                imageSource={Constants.appIconOutline}
                message={translate("Home_emptyDocumentList")}
                visible={documents.length === 0}
            />

            <FAB
                icon={"plus"}
                mode={"flat"}
                style={{ position: "absolute", right: safeAreaInsets.right, bottom: safeAreaInsets.bottom, margin: 16 }}
                onPress={() => navigation.navigate("Camera")}
            />

            <LoadingModal
                visible={showDocumentDeletionModal}
                message={translate("Home_deletingDocuments")}
            />
        </Screen>
    )
}

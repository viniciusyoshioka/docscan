import { useNavigation } from "@react-navigation/native"
import { Realm } from "@realm/react"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { useCallback, useEffect, useState } from "react"
import { Alert, View } from "react-native"
import DocumentPicker from "react-native-document-picker"
import RNFS from "react-native-fs"
import { Divider, FAB } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelectionMode } from "react-native-selection-mode"
import { unzip } from "react-native-zip-archive"

import {
  DocumentPictureSchema,
  DocumentSchema,
  ExportedDocumentPictureRealm,
  ExportedDocumentRealm,
  openExportedDatabase,
  useDocumentModel,
  useDocumentRealm,
} from "@database"
import { useBackHandler } from "@hooks"
import { useLogger } from "@libs/logger"
import { TranslationKeyType, translate } from "@locales"
import { NavigationProps } from "@router"
import { Constants } from "@services/constant"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { getNotificationPermission } from "@services/permission"
import { stringifyError } from "@utils"
import { EmptyScreen, LoadingModal } from "react-native-paper-towel"
import { DOCUMENT_ITEM_HEIGHT, DocumentItem } from "./DocumentItem"
import { HomeHeader } from "./Header"
import { useDocuments } from "./useDocuments"


// TODO improve database operations in deleteSelectedDocuments
// TODO improve database operations in importDocuments
// TODO improve database operations in exportSelectedDocuments
// TODO add comunication with background service to alert when export is done
// TODO add comunication with background service to alert when import is done
export function Home() {


  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProps<"Home">>()

  const logger = useLogger()
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
    documentSelection.setNewSelectedData(current => {
      return new Set(documents
        .filter(documentItem => !current.has(documentItem.id.toHexString()))
        .map(documentItem => documentItem.id.toHexString()))
    })
  }

  async function deleteSelectedDocuments() {
    try {
      setShowDocumentDeletionModal(true)

      const documentIdsToDelete = documentSelection
        .getSelectedData()
        .map(documentId => Realm.BSON.ObjectId.createFromHexString(documentId))

      const picturesToDelete = documentRealm
        .objects(DocumentPictureSchema)
        .filtered("belongsTo IN $0", documentIdsToDelete)

      const documentsToDelete = documentRealm
        .objects(DocumentSchema)
        .filtered("id IN $0", documentIdsToDelete)

      documentRealm.beginTransaction()
      documentRealm.delete(picturesToDelete)
      documentRealm.delete(documentsToDelete)
      documentRealm.commitTransaction()

      const picturesPathToDelete = picturesToDelete.map(picture => (
        DocumentService.getPicturePath(picture.fileName)
      ))
      DocumentService.deletePicturesService({ pictures: picturesPathToDelete })
    } catch (error) {
      if (documentRealm.isInTransaction) {
        documentRealm.cancelTransaction()
      }

      await logger.error(`Error deleting selected documents: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("Home_alert_errorDeletingSelectedDocuments_text"),
      )
    } finally {
      documentSelection.exitSelection()
      setShowDocumentDeletionModal(false)
    }
  }

  function alertDeleteDocuments() {
    Alert.alert(
      translate("Home_alert_deleteDocuments_title"),
      translate("Home_alert_deleteDocuments_text"),
      [
        { text: translate("cancel"), onPress: () => {} },
        { text: translate("delete"), onPress: deleteSelectedDocuments },
      ],
    )
  }

  async function importDocuments() {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        copyTo: "cachesDirectory",
        type: DocumentPicker.types.zip,
      })

      if (pickedFile.copyError !== undefined)
        throw new Error(`Error copying picked file to import document: "${stringifyError(pickedFile.copyError)}"`)
      if (pickedFile.fileCopyUri === undefined)
        throw new Error("Copying document to import did not returned a valid path")

      Alert.alert(
        translate("Home_alert_importDocuments_title"),
        translate("Home_alert_importDocuments_text"),
      )
      await createAllFolders()

      const fileUri = pickedFile.fileCopyUri?.replaceAll("%20", " ").replace("file://", "")
      if (fileUri === undefined) {
        throw new Error("Copying document to import did not returned a valid path")
      }
      await unzip(fileUri, Constants.fullPathTemporaryImported)
      await RNFS.unlink(fileUri)

      const pictureToMove: string[] = []
      const exportedDatabase = await openExportedDatabase(
        Constants.importDatabaseFullPath,
      )
      const exportedDocuments = exportedDatabase
        .objects<ExportedDocumentRealm>("ExportedDocumentSchema")
        .sorted("modifiedAt")

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
          .filtered("belongsTo = $0", exportedDocument.id)
        for (let j = 0; j < exportedPictures.length; j++) {
          const exportedPicture = exportedPictures[j]
          const newPicturePath = await DocumentService.getNewPicturePath(
            exportedPicture.fileName,
          )
          const newPictureName = DocumentService.getFileFullname(newPicturePath)

          documentRealm.create(DocumentPictureSchema, {
            fileName: newPictureName,
            position: exportedPicture.position,
            belongsTo: importedDocument.id,
          })

          pictureToMove.push(
            DocumentService.getTemporaryImportedPicturePath(exportedPicture.fileName),
          )
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
        await logger.error(`Error deleting temporary imported files after error in document import: "${stringifyError(error)}"`)
      }

      await logger.error(`Error importing document: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("Home_alert_errorImportingDocuments_text"),
      )
    }
  }

  async function exportSelectedDocuments() {
    Alert.alert(
      translate("Home_alert_exportingDocuments_title"),
      translate("Home_alert_exportingDocuments_text"),
    )

    await createAllFolders()
    try {
      const exportedDatabase = await openExportedDatabase(
        Constants.exportDatabaseFullPath,
      )

      const selectedDocumentsObjectId = documentSelection
        .getSelectedData()
        .map(Realm.BSON.ObjectId.createFromHexString)
      const documentsToExport = documentSelection.isSelectionMode
        ? documents.filtered("id IN $0", selectedDocumentsObjectId)
        : documents

      const filesToCopy: string[] = []

      exportedDatabase.write(() => {
        documentsToExport.forEach(documentToExport => {
          const exportedDocument = exportedDatabase.create<ExportedDocumentRealm>(
            "ExportedDocumentSchema",
            {
              createdAt: documentToExport.createdAt,
              modifiedAt: documentToExport.modifiedAt,
              name: documentToExport.name,
            },
          )

          documentRealm
            .objects(DocumentPictureSchema)
            .filtered("belongsTo = $0", documentToExport.id)
            .forEach(pictureToExport => {
              filesToCopy.push(DocumentService.getPicturePath(pictureToExport.fileName))

              exportedDatabase.create<ExportedDocumentPictureRealm>(
                "ExportedDocumentPictureSchema",
                {
                  fileName: pictureToExport.fileName,
                  position: pictureToExport.position,
                  belongsTo: exportedDocument.id,
                },
              )
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
      await logger.error(`Error exporting documents before invoking the background service: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("Home_alert_errorExportingDocuments_text"),
      )
    }

    if (documentSelection.isSelectionMode) {
      documentSelection.exitSelection()
    }
  }

  function alertExportDocuments() {
    if (documents.length === 0) {
      Alert.alert(
        translate("warn"),
        translate("Home_alert_noDocumentsToExport_text"),
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
        { text: translate("Home_export"), onPress: exportSelectedDocuments },
      ],
    )
  }

  // TODO merge selected documents
  async function mergeSelectedDocuments() {
    documentSelection.exitSelection()
  }

  function alertMergeDocuments() {
    Alert.alert(
      translate("Home_alert_mergeDocuments_title"),
      translate("Home_alert_mergeDocuments_text"),
      [
        { text: translate("cancel"), onPress: () => {} },
        { text: translate("Home_merge"), onPress: mergeSelectedDocuments },
      ],
    )
  }

  // TODO duplicate selected documents
  async function duplicateSelectedDocuments() {
    documentSelection.exitSelection()
  }

  function alertDuplicateDocuments() {
    Alert.alert(
      translate("Home_alert_duplicateDocuments_title"),
      translate("Home_alert_duplicateDocuments_text"),
      [
        { text: translate("cancel"), onPress: () => {} },
        { text: translate("Home_duplicate"), onPress: duplicateSelectedDocuments },
      ],
    )
  }

  const openDocument = useCallback((document: DocumentSchema) => {
    const pictures = documentRealm
      .objects(DocumentPictureSchema)
      .filtered("belongsTo = $0", document.id)
      .sorted("position")

    setDocumentModel({ document, pictures })
    navigation.navigate("EditDocument")
  }, [documentRealm, navigation])

  const renderItem: ListRenderItem<DocumentSchema> = useCallback(({ item }) => {
    const id = item.id.toHexString()

    return (
      <DocumentItem
        onClick={() => openDocument(item)}
        onSelect={() => documentSelection.select(id)}
        onDeselect={() => documentSelection.deselect(id)}
        isSelectionMode={documentSelection.isSelectionMode}
        isSelected={documentSelection.isSelected(id)}
        document={item}
      />
    )
  }, [
    openDocument,
    documentSelection.select,
    documentSelection.deselect,
    documentSelection.isSelectionMode,
    documentSelection.isSelected,
  ])


  useEffect(() => {
    async function requestPermissions() {
      const hasPermission = await getNotificationPermission()
      if (!hasPermission) {
        Alert.alert(
          translate("Home_alert_notificationPermissionDenied_title"),
          translate("Home_alert_notificationPermissionDenied_text"),
        )
      }
    }

    requestPermissions()
  }, [])


  return (
    <View style={{ flex: 1 }}>
      <HomeHeader
        isSelectionMode={documentSelection.isSelectionMode}
        selectedDocumentsAmount={documentSelection.length}
        exitSelectionMode={documentSelection.exitSelection}
        invertSelection={invertSelection}
        deleteSelectedDocuments={alertDeleteDocuments}
        importDocument={importDocuments}
        exportDocument={alertExportDocuments}
        mergeDocument={alertMergeDocuments}
        duplicateDocument={alertDuplicateDocuments}
      />

      {documents.length > 0 && (
        <FlashList
          data={documents as unknown as DocumentSchema[]}
          renderItem={renderItem}
          extraData={documentSelection.getSelectedData()}
          estimatedItemSize={DOCUMENT_ITEM_HEIGHT}
          ItemSeparatorComponent={() => <Divider style={{ marginHorizontal: 16 }} />}
          contentContainerStyle={{ paddingBottom: (16 * 2) + 56 + safeAreaInsets.bottom }}
        />
      )}

      <EmptyScreen.Content visible={documents.length === 0}>
        <EmptyScreen.Image source={Constants.appIconOutline} />

        <EmptyScreen.Message>
          {translate("Home_emptyDocumentList")}
        </EmptyScreen.Message>
      </EmptyScreen.Content>

      <FAB
        icon={"plus"}
        mode={"flat"}
        style={{
          position: "absolute",
          right: safeAreaInsets.right,
          bottom: safeAreaInsets.bottom,
          margin: 16,
        }}
        onPress={() => navigation.navigate("Camera")}
      />

      <LoadingModal
        visible={showDocumentDeletionModal}
        message={translate("Home_deletingDocuments")}
      />
    </View>
  )
}

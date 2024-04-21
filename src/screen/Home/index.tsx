import { useNavigation } from "@react-navigation/native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { Alert, View } from "react-native"
import { Divider, FAB } from "react-native-paper"
import { EmptyScreen, LoadingModal, useModal } from "react-native-paper-towel"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelectionMode } from "react-native-selection-mode"

import { Document, IdOf, WithId, useDatabase } from "@database"
import { useBackHandler } from "@hooks"
import { useDocumentManager } from "@lib/document-state"
import { useLogger } from "@lib/log"
import { TranslationKeyType, translate } from "@locales"
import { NavigationProps } from "@router"
import { Constants } from "@services/constant"
import { DocumentService } from "@services/document"
import { stringifyError } from "@utils"
import { DOCUMENT_ITEM_HEIGHT, DocumentItem } from "./DocumentItem"
import { HomeHeader } from "./Header"
import { useDocuments } from "./useDocuments"
import { useRequestNotificationPermission } from "./useRequestNotificationPermission"


// TODO improve database operations in deleteSelectedDocument
// TODO improve database operations in importDocument
// TODO improve database operations in exportSelectedDocument
// TODO add comunication with background service to alert when export is done
// TODO add comunication with background service to alert when import is done
export function Home() {


  useRequestNotificationPermission()


  const safeAreaInsets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProps<"Home">>()

  const log = useLogger()
  const documents = useDocuments()
  const { documentModel, documentPictureModel } = useDatabase()
  const documentManager = useDocumentManager()
  const documentSelection = useSelectionMode<IdOf<Document>>()
  const documentDeletionModal = useModal()


  useBackHandler(() => {
    if (documentSelection.isSelectionMode) {
      documentSelection.exitSelection()
      return true
    }
    return false
  })


  function invertSelection() {
    documentSelection.setNewSelectedData(current => {
      const newSelectedData = new Set<IdOf<Document>>()

      documents.forEach(documentItem => {
        if (!current.has(documentItem.id)) {
          newSelectedData.add(documentItem.id)
        }
      })

      return newSelectedData
    })
  }

  async function deleteSelectedDocument() {
    documentDeletionModal.show()

    try {
      const selectedDocuments = documentSelection.getSelectedData()

      for (const documentId of selectedDocuments) {
        const pictures = documentPictureModel.selectAllForDocument(documentId)
        const picturesId = pictures.map(picture => picture.id)
        const picturesPath = pictures.map(picture => (
          DocumentService.getPicturePath(picture.fileName)
        ))

        documentPictureModel.deleteMultiple(picturesId)
        documentModel.deleteMultiple(selectedDocuments)
        DocumentService.deletePicturesService({
          pictures: picturesPath,
        })
      }

      documentSelection.exitSelection()
    } catch (error) {
      log.error(`Error deleting selected documents: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("Home_alert_errorDeletingSelectedDocuments_text")
      )
    } finally {
      documentSelection.exitSelection()
      documentDeletionModal.hide()
    }
  }

  function alertDeleteDocument() {
    Alert.alert(
      translate("Home_alert_deleteDocuments_title"),
      translate("Home_alert_deleteDocuments_text"),
      [
        { text: translate("cancel"), onPress: () => {} },
        { text: translate("delete"), onPress: deleteSelectedDocument },
      ]
    )
  }

  // TODO implement importDocument using new database
  async function importDocument() {}

  // TODO implement exportSelectedDocument using new database
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
        { text: translate("Home_export"), onPress: exportSelectedDocument },
      ]
    )
  }

  const renderItem: ListRenderItem<WithId<Document>> = ({ item }) => {
    const documentId = item.id

    return (
      <DocumentItem
        onClick={() => {
          documentManager.open(documentId)
          navigation.navigate("EditDocument")
        }}
        onSelect={() => documentSelection.select(documentId)}
        onDeselect={() => documentSelection.deselect(documentId)}
        isSelectionMode={documentSelection.isSelectionMode}
        isSelected={documentSelection.isSelected(documentId)}
        document={item}
      />
    )
  }

  const keyExtractor = (item: WithId<Document>) => item.id


  return (
    <View style={{ flex: 1 }}>
      <HomeHeader
        isSelectionMode={documentSelection.isSelectionMode}
        selectedDocumentsAmount={documentSelection.length()}
        exitSelectionMode={documentSelection.exitSelection}
        invertSelection={invertSelection}
        deleteSelectedDocuments={alertDeleteDocument}
        importDocument={importDocument}
        exportDocument={alertExportDocument}
      />

      {documents.length > 0 && (
        <FlashList
          data={documents}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
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
        visible={documentDeletionModal.isVisible}
        message={translate("Home_deletingDocuments")}
      />
    </View>
  )
}

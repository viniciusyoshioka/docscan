import { useNavigation } from "@react-navigation/core"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { Alert, View } from "react-native"
import { LoadingModal, useModal } from "react-native-paper-towel"
import { useSelectionMode } from "react-native-selection-mode"

import { DocumentPicture, IdOf, WithId } from "@database"
import { useBackHandler } from "@hooks"
import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { DocumentService } from "@services/document"
import { stringifyError } from "@utils"
import { EditDocumentHeader } from "./Header"
import { PictureItem, useColumnCount, usePictureItemSize } from "./Pictureitem"
import { useDeleteSelectedPictures } from "./useDeleteSelectedPictures"


export { ConvertPdfOption } from "./ConvertPdfOption"
export { RenameDocument } from "./RenameDocument"


// TODO implement drag and drop to reorder list
// TODO implement split selected images to new document
export function EditDocument() {


  const navigation = useNavigation<NavigationProps<"EditDocument">>()
  const log = useLogger()

  const { documentState, updateDocumentState } = useDocumentState()
  const { document, pictures } = documentState as DocumentStateData

  const columnCount = useColumnCount()
  const estimatedItemSize = usePictureItemSize()

  const pictureSelection = useSelectionMode<IdOf<DocumentPicture>>()
  const deletingPicturesModal = useModal()
  const deleteSelectedPictures = useDeleteSelectedPictures(
    pictureSelection.getSelectedData()
  )


  useBackHandler(() => {
    goBack()
    return true
  })


  function goBack() {
    if (pictureSelection.isSelectionMode) {
      pictureSelection.exitSelection()
      return
    }

    setDocumentModel(undefined)
    navigation.goBack()
  }

  async function deletePdf() {
    if (!document)
      throw new Error("There is no document to delete the PDF, this should not happen")

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
      log.error(`Error deleting PDF file "${stringifyError(error)}"`)
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

  function invertSelection() {
    pictureSelection.setNewSelectedData(current => {
      const newSelectedData = new Set<IdOf<DocumentPicture>>()
      pictures.forEach(item => {
        if (!current.has(item.id)) {
          newSelectedData.add(item.id)
        }
      })
      return newSelectedData
    })
  }

  async function deleteSelectedPicture() {
    deletingPicturesModal.show()

    try {
      deleteSelectedPictures()
    } catch (error) {
      log.error(`Error deleting selected pictures: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("EditDocument_alert_errorDeletingSelectedPictures_text")
      )
    } finally {
      pictureSelection.exitSelection()
      deletingPicturesModal.hide()
    }
  }

  function alertDeletePicture() {
    Alert.alert(
      translate("EditDocument_alert_deletePicture_title"),
      translate("EditDocument_alert_deletePicture_text"),
      [
        { text: translate("cancel") },
        { text: translate("ok"), onPress: deleteSelectedPicture },
      ]
    )
  }

  const renderItem: ListRenderItem<WithId<DocumentPicture>> = ({ item, index }) => {
    const pictureId = item.id

    return (
      <PictureItem
        onClick={() => navigation.navigate("VisualizePicture", { pictureIndex: index })}
        onSelect={() => pictureSelection.select(pictureId)}
        onDeselect={() => pictureSelection.deselect(pictureId)}
        isSelectionMode={pictureSelection.isSelectionMode}
        isSelected={pictureSelection.isSelected(pictureId)}
        picturePath={DocumentService.getPicturePath(item.fileName)}
      />
    )
  }

  const keyExtractor = (item: WithId<DocumentPicture>) => item.id


  return (
    <View style={{ flex: 1 }}>
      <EditDocumentHeader
        goBack={goBack}
        exitSelectionMode={pictureSelection.exitSelection}
        isSelectionMode={pictureSelection.isSelectionMode}
        selectedPicturesAmount={pictureSelection.length()}
        invertSelection={invertSelection}
        deletePicture={alertDeletePicture}
        openCamera={() => navigation.navigate("Camera", { screenAction: "add-picture" })}
        deletePdf={alertDeletePdf}
      />

      <FlashList
        data={pictures}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={[pictureSelection.isSelectionMode]}
        estimatedItemSize={estimatedItemSize}
        numColumns={columnCount}
        contentContainerStyle={{ padding: 4 }}
      />

      <LoadingModal
        message={translate("EditDocument_deletingPictures")}
        visible={deletingPicturesModal.isVisible}
      />
    </View>
  )
}

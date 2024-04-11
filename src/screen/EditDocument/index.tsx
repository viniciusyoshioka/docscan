import { useNavigation } from "@react-navigation/core"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { useCallback, useMemo, useState } from "react"
import { Alert, View, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { LoadingModal } from "react-native-paper-towel"
import { useSelectionMode } from "react-native-selection-mode"
import Share from "react-native-share"

import {
  DocumentPictureRealmSchema,
  DocumentRealmSchema,
  useDocumentModel,
  useDocumentRealm,
} from "@database"
import { useBackHandler } from "@hooks"
import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { DocumentService } from "@services/document"
import { PdfCreator } from "@services/pdf-creator"
import { getReadPermission, getWritePermission } from "@services/permission"
import { stringifyError } from "@utils"
import { EditDocumentHeader } from "./Header"
import {
  HORIZONTAL_COLUMN_COUNT,
  PictureItem,
  VERTICAL_COLUMN_COUNT,
  getPictureItemSize,
} from "./Pictureitem"


export { ConvertPdfOption } from "./ConvertPdfOption"
export { RenameDocument } from "./RenameDocument"


// TODO implement drag and drop to reorder list
// TODO implement split selected images to new document
export function EditDocument() {


  const navigation = useNavigation<NavigationProps<"EditDocument">>()
  const log = useLogger()

  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const { documentModel, setDocumentModel } = useDocumentModel()
  const documentRealm = useDocumentRealm()
  const document = documentModel?.document ?? undefined
  const pictures = useMemo(() => {
    if (document === undefined) return []

    return documentRealm.objects(DocumentPictureRealmSchema)
      .filtered("belongsTo = $0", document.id)
      .sorted("position")
      .toJSON() as unknown as DocumentPictureRealmSchema[]
  }, [document])

  const columnCount = useMemo(
    () => (windowWidth < windowHeight)
      ? VERTICAL_COLUMN_COUNT
      : HORIZONTAL_COLUMN_COUNT
    , [windowWidth, windowHeight]
  )
  const estimatedItemSize = getPictureItemSize(windowWidth, columnCount)

  const pictureSelection = useSelectionMode<number>()
  const [isDeletingPictures, setIsDeletingPictures] = useState(false)


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
        failOnCancel: false,
      })
    } catch (error) {
      log.error(`Error sharing PDF file: "${stringifyError(error)}"`)
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
    pictureSelection.setSelectedData(current => {
      const newSelectedData: number[] = []
      for (let i = 0; i < pictures.length; i++) {
        if (!current.includes(i)) newSelectedData.push(i)
      }
      return newSelectedData
    })
  }

  async function deleteSelectedPicture() {
    if (!document)
      throw new Error(
        "There is no document to delete its pictures, this should not happen"
      )

    setIsDeletingPictures(true)

    const picturePathsToDelete = pictureSelection.selectedData.map(index => (
      DocumentService.getPicturePath(pictures[index].fileName)
    ))

    try {
      documentRealm.write(() => {
        const realmPicturesToDelete = documentRealm.objects(DocumentPictureRealmSchema)
          .filtered("belongsTo = $0", document.id)
          .sorted("position")
          .filter((_, index) => pictureSelection.selectedData.includes(index))

        documentRealm.delete(realmPicturesToDelete)
        document.modifiedAt = Date.now()
      })

      const updatedDocument = documentRealm.objectForPrimaryKey(
        DocumentRealmSchema,
        document.id
      )
      const updatedPictures = documentRealm
        .objects(DocumentPictureRealmSchema)
        .filtered("belongsTo = $0", document.id)
        .sorted("position")
      if (!updatedDocument)
        throw new Error("Document is undefined, this should not happen")
      setDocumentModel({ document: updatedDocument, pictures: updatedPictures })

      DocumentService.deletePicturesService({ pictures: picturePathsToDelete })
    } catch (error) {
      log.error(`Error deleting selected pictures from database: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("EditDocument_alert_errorDeletingSelectedPictures_text")
      )
    }

    pictureSelection.exitSelection()
    setIsDeletingPictures(false)
  }

  function alertDeletePicture() {
    if (!document)
      throw new Error(
        "There is no document to delete its pictures, this should not happen"
      )

    Alert.alert(
      translate("EditDocument_alert_deletePicture_title"),
      translate("EditDocument_alert_deletePicture_text"),
      [
        { text: translate("cancel"), onPress: () => {} },
        { text: translate("ok"), onPress: deleteSelectedPicture },
      ]
    )
  }

  const renderItem: ListRenderItem<DocumentPictureRealmSchema> = ({ item, index }) => {
    return (
      <PictureItem
        onClick={() => navigation.navigate("VisualizePicture", { pictureIndex: index })}
        onSelect={() => pictureSelection.select(index)}
        onDeselect={() => pictureSelection.deselect(index)}
        isSelectionMode={pictureSelection.isSelectionMode}
        isSelected={pictureSelection.selectedData.includes(index)}
        picturePath={DocumentService.getPicturePath(item.fileName)}
        columnCount={columnCount}
      />
    )
  }

  const keyExtractor = useCallback((_: DocumentPictureRealmSchema, index: number) => (
    index.toString()
  ), [])


  return (
    <View style={{ flex: 1 }}>
      <EditDocumentHeader
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
        visible={isDeletingPictures}
      />
    </View>
  )
}

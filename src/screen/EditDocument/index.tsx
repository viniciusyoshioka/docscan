import { useNavigation } from "@react-navigation/core"
import { useCallback } from "react"
import { View } from "react-native"
import { LoadingModal } from "react-native-paper-towel"
import { useSelectionMode } from "react-native-selection-mode"

import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { EditDocumentHeader, PicturesList } from "./components"
import {
  useDeleteDocument,
  useDeletePdf,
  useDeletePictures,
  useGoBack,
  useInvertPicturesSelection,
  useSharePdf,
  useVisualizePdf,
} from "./hooks"


export * from "./modals"


// TODO implement drag and drop to reorder list
// TODO implement split selected images to new document
export function EditDocument() {


  const navigation = useNavigation<NavigationProps<"EditDocument">>()

  const pictureSelection = useSelectionMode<string>()


  const goBack = useGoBack({
    isSelectionMode: pictureSelection.isSelectionMode,
    exitSelection: pictureSelection.exitSelection,
  })

  useBackHandler(goBack)


  const invertPicturesSelection = useInvertPicturesSelection()
  const deletePictures = useDeletePictures()
  const sharePdf = useSharePdf()
  const visualizePdf = useVisualizePdf()
  const deletePdf = useDeletePdf()
  const deleteDocument = useDeleteDocument()


  const openCamera = useCallback(() => {
    navigation.navigate("Camera", { action: "add-picture" })
  }, [navigation])

  const convertToPdf = useCallback(() => {
    navigation.navigate("ConvertPdfOption")
  }, [navigation])

  const renameDocument = useCallback(() => {
    navigation.navigate("RenameDocument")
  }, [navigation])


  return (
    <View style={{ flex: 1 }}>
      <EditDocumentHeader
        isSelectionMode={pictureSelection.isSelectionMode}
        goBack={goBack}
        exitSelection={pictureSelection.exitSelection}
        selectedPicturesCount={pictureSelection.length}
        openCamera={openCamera}
        convertToPdf={convertToPdf}
        sharePdf={sharePdf}
        visualizePdf={visualizePdf}
        renameDocument={renameDocument}
        deletePdf={deletePdf}
        invertPicturesSelection={invertPicturesSelection}
        deletePictures={deletePictures}
        deleteDocument={deleteDocument}
      />

      <PicturesList
        isSelectionMode={pictureSelection.isSelectionMode}
        selectItem={pictureSelection.select}
        deselectItem={pictureSelection.deselect}
        isItemSelected={pictureSelection.isSelected}
      />

      <LoadingModal
        message={translate("EditDocument_deletingPictures")}
        visible={false}
      />
    </View>
  )
}

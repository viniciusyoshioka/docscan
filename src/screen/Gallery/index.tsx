import { useCallback } from "react"
import { View } from "react-native"
import { LoadingModal, useModal } from "react-native-paper-towel"
import { useSelectionMode } from "react-native-selection-mode"

import { useBackHandler } from "@hooks"
import { translate } from "@locales"
import { ErrorImportingImagesModal, GalleryHeader, ImagesList } from "./components"
import { useGoBack, useImportImages } from "./hooks"


// TODO increse ImageItem size when app window is small
export function Gallery() {


  const gallerySelection = useSelectionMode<string>()
  const errorImportingImagesModal = useModal()


  const importImages = useImportImages({
    onError: errorImportingImagesModal.show,
  })

  const importSelectedImages = useCallback(async () => {
    const selectedImagesPath = gallerySelection.getSelectedData()
    await importImages.importImages(selectedImagesPath)
  }, [gallerySelection.getSelectedData, importImages.importImages])

  const goBack = useGoBack({
    hasBlockingModal: importImages.isImporting,
    isSelectionMode: gallerySelection.isSelectionMode,
    exitSelection: gallerySelection.exitSelection,
    isErrorImportingImagesModalVisible: errorImportingImagesModal.isVisible,
    hideErrorImportingImagesModal: errorImportingImagesModal.hide,
  })


  useBackHandler(goBack)


  return (
    <View style={{ flex: 1 }}>
      <GalleryHeader
        goBack={goBack}
        exitSelection={gallerySelection.exitSelection}
        importImages={importSelectedImages}
        isSelectionMode={gallerySelection.isSelectionMode}
        selectedImagesCount={gallerySelection.length}
      />

      <ImagesList
        selectItem={gallerySelection.select}
        deselectItem={gallerySelection.deselect}
        isItemSelected={gallerySelection.isSelected}
        isSelectionMode={gallerySelection.isSelectionMode}
        getSelectedData={gallerySelection.getSelectedData}
        importImages={importImages.importImages}
      />

      <LoadingModal
        message={translate("Gallery_importingPictures")}
        visible={importImages.isImporting}
      />

      <ErrorImportingImagesModal
        isVisible={errorImportingImagesModal.isVisible}
        onDismiss={errorImportingImagesModal.hide}
      />
    </View>
  )
}

import { View } from 'react-native'
import { LoadingModal } from 'react-native-paper-towel'
import { useSelectionMode } from 'react-native-selection-mode'

import { Header } from '@components'
import { useBackHandler } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import type { ImageResource } from './components'
import { ImagesList } from './components'
import { useGalleryHeader, useGoBack, useImportImages } from './hooks'


// TODO: Increase ImageItem size when app window is small
export function Gallery() {


  const { t } = useLocale()


  const gallerySelection = useSelectionMode<ImageResource>()

  const importImages = useImportImages({
    getSelectedImages: gallerySelection.getSelectedData,
    isSelectionMode: gallerySelection.isSelectionMode,
    exitSelection: gallerySelection.exitSelection,
  })

  const goBack = useGoBack({
    hasBlockingModal: importImages.isImporting,
    isSelectionMode: gallerySelection.isSelectionMode,
    exitSelection: gallerySelection.exitSelection,
  })

  const galleryHeader = useGalleryHeader({
    isSelectionMode: gallerySelection.isSelectionMode,
    selectedImagesCount: gallerySelection.length,
    importSelectedImages: importImages.importSelectedImages,
  })


  useBackHandler(goBack)


  return (
    <View style={{ flex: 1 }}>
      <Header
        isSelectionMode={gallerySelection.isSelectionMode}
        onExitSelection={gallerySelection.exitSelection}
        onGoBack={goBack}
        title={galleryHeader.title}
        RightComponentSelectionMode={galleryHeader.RightComponentSelectionMode}
      />

      <ImagesList
        selectItem={gallerySelection.select}
        deselectItem={gallerySelection.deselect}
        isItemSelected={gallerySelection.isSelected}
        isSelectionMode={gallerySelection.isSelectionMode}
        getSelectedData={gallerySelection.getSelectedData}
        importSingleImage={importImages.importSingleImage}
      />

      <LoadingModal
        message={t('Gallery_importingPictures', { ns: Namespaces.APP })}
        visible={importImages.isImporting}
      />
    </View>
  )
}

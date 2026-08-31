import { View } from 'react-native'
import { useSelectionMode } from 'react-native-selection-mode'

import { Header } from '@components'
import type { PictureId } from '@database'
import { useBackHandler } from '@hooks'
import { PicturesList } from './components'
import {
  useDeleteSelectedPictures,
  useDocumentDetailHeader,
  useGoBack,
} from './hooks'


export * from './modals'


// TODO implement drag and drop to reorder list
// TODO implement split selected images to new document
export function DocumentDetail() {


  const pictureSelection = useSelectionMode<PictureId>()

  const goBack = useGoBack({
    isSelectionMode: pictureSelection.isSelectionMode,
    exitSelection: pictureSelection.exitSelection,
  })

  const deleteSelectedPictures = useDeleteSelectedPictures({
    getSelectedPictureIds: pictureSelection.getSelectedData,
    exitSelection: pictureSelection.exitSelection,
  })

  const header = useDocumentDetailHeader({
    deleteSelectedPictures: deleteSelectedPictures.deleteSelectedPictures,
    isSelectionMode: pictureSelection.isSelectionMode,
    selectedPicturesCount: pictureSelection.length,
    setSelectedData: pictureSelection.setNewSelectedData,
  })


  useBackHandler(goBack)


  return (
    <View style={{ flex: 1 }}>
      <Header
        isSelectionMode={pictureSelection.isSelectionMode}
        onExitSelection={pictureSelection.exitSelection}
        title={header.headerTitle}
        onGoBack={goBack}
        RightComponent={header.RightComponent}
        RightComponentSelectionMode={header.RightComponentSelectionMode}
        menuItems={header.menuItems}
      />

      <PicturesList
        isSelectionMode={pictureSelection.isSelectionMode}
        selectItem={pictureSelection.select}
        deselectItem={pictureSelection.deselect}
        isItemSelected={pictureSelection.isSelected}
      />
    </View>
  )
}

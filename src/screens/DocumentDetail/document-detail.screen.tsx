import { useCallback } from 'react'
import { View } from 'react-native'

import { Header } from '@components'
import type { PictureId } from '@database'
import { useBackHandler } from '@hooks'
import { useSelectionMode } from '@modules/selection-mode'
import type { OnFinishLoadingPictureList } from './components'
import { PicturesList } from './components'
import {
  useDeleteSelectedPictures,
  useDocumentDetailHeader,
  useGoBack,
} from './hooks'


export * from './modals'


// TODO implement drag and drop to reorder list
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
    invertPictureSelection: pictureSelection.invert,
  })

  const onFinishLoadingPictureList: OnFinishLoadingPictureList = useCallback(
    params => {
      pictureSelection.setTotalCount(params.totalPictures)
    },
    [pictureSelection],
  )


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
        onFinishLoadingPictureList={onFinishLoadingPictureList}
        isSelectionMode={pictureSelection.isSelectionMode}
        selectItem={pictureSelection.select}
        deselectItem={pictureSelection.deselect}
        isItemSelected={pictureSelection.isSelected}
      />
    </View>
  )
}

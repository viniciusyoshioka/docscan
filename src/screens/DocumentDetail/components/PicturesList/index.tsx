import { useCallback } from 'react'
import type { ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  ErrorLoadingList,
  ErrorLoadingMoreItems,
  LoadingMoreItems,
} from '@components'
import type { PictureEntity, PictureId } from '@database'
import { Namespaces, useLocale } from '@locale'
import { useDocumentState } from '@modules/document-state'
import {
  EmptyPictures,
  LoadingPictures,
  PICTURE_ITEM_MARGIN,
  PictureItem,
  usePictureItemSize,
} from './components'
import {
  PicturesListStatus,
  useGoToPictureDetailScreen,
  usePicturesColumnCount,
  usePicturesList,
  usePicturesRowCountInList,
} from './hooks'


interface ExtraData {
  goToPictureDetailScreen: (pictureIndex: number) => void
  selectItem: (pictureId: PictureId) => void
  deselectItem: (pictureId: PictureId) => void
  isItemSelected: (pictureId: PictureId) => boolean
  isSelectionMode: boolean
  pictureItemSize: number
}


interface PicturesListProps {
  isSelectionMode: boolean
  selectItem: (pictureId: PictureId) => void
  deselectItem: (pictureId: PictureId) => void
  isItemSelected: (pictureId: PictureId) => boolean
}


export function PicturesList(props: PicturesListProps) {


  const safeAreaInsets = useSafeAreaInsets()

  const { t } = useLocale()
  const { pictures } = useDocumentState()

  const goToPictureDetailScreen = useGoToPictureDetailScreen()
  const columnCount = usePicturesColumnCount()
  const pictureItemSize = usePictureItemSize()
  const picturesRowCountInList = usePicturesRowCountInList()
  const picturesList = usePicturesList()


  const renderItem: ListRenderItem<PictureEntity> = useCallback(info => {
    // TODO: Check if is required to replace inline functions with useCallback
    // TODO: Update react-native-selection-mode to allow passing the functions
    // to the component and the useSelectableItem passes the value to these
    // functions

    const picture = info.item

    return (
      <PictureItem
        onClick={() => goToPictureDetailScreen(info.index)}
        onSelect={() => props.selectItem(picture.id)}
        onDeselect={() => props.deselectItem(picture.id)}
        isSelectionMode={props.isSelectionMode}
        isSelected={props.isItemSelected(picture.id)}
        item={picture}
        pictureItemSize={pictureItemSize}
      />
    )
  }, [
    goToPictureDetailScreen,
    props.selectItem,
    props.deselectItem,
    props.isSelectionMode,
    props.isItemSelected,
    pictureItemSize,
  ])

  /*
  const extraData = useMemo<ExtraData>(() => {
    return {
      goToPictureDetailScreen,
      selectItem: props.selectItem,
      deselectItem: props.deselectItem,
      isItemSelected: props.isItemSelected,
      isSelectionMode: props.isSelectionMode,
      pictureItemSize,
    }
  }, [
    goToPictureDetailScreen,
    props.selectItem,
    props.deselectItem,
    props.isItemSelected,
    props.isSelectionMode,
    pictureItemSize,
  ])
  */

  const keyExtractor = useCallback((item: PictureEntity): string => {
    return String(item.id)
  }, [])

  const onEndReached = useCallback(async () => {
    const picturesLength = pictures?.length ?? 0
    const currentRowAmount = (picturesLength / columnCount)
    if (currentRowAmount < picturesRowCountInList) {
      return
    }

    await picturesList.loadMorePictures()
  }, [
    pictures,
    columnCount,
    picturesRowCountInList,
    picturesList.loadMorePictures,
  ])

  const ListFooterComponent = useCallback(() => {
    if (picturesList.status === PicturesListStatus.IS_LOADING_MORE) {
      return <LoadingMoreItems />
    }

    if (picturesList.status === PicturesListStatus.HAS_ERROR_LOADING_MORE) {
      return (
        <ErrorLoadingMoreItems
          title={t(
            'DocumentDetail_errorLoadingMorePictures_title',
            { ns: Namespaces.APP },
          )}
          tryAgain={picturesList.loadMorePictures}
        />
      )
    }

    return null
  }, [picturesList.status, t, picturesList.loadMorePictures])


  if (picturesList.status === PicturesListStatus.IS_LOADING) {
    return <LoadingPictures />
  }

  if (picturesList.status === PicturesListStatus.HAS_ERROR) {
    return (
      <ErrorLoadingList
        description={t(
          'DocumentDetail_errorLoadingPictures_text',
          { ns: Namespaces.APP },
        )}
        tryAgain={picturesList.loadPictures}
      />
    )
  }

  if (picturesList.status === PicturesListStatus.IS_EMPTY) {
    return <EmptyPictures />
  }

  return (
    <FlatList
      data={pictures ?? []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      // Disabled due to a bug in recycle items of other list components
      // TODO: Enable prop after the list library fixes the bug
      // extraData={extraData}
      numColumns={columnCount}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={{
        padding: PICTURE_ITEM_MARGIN,
        paddingLeft: PICTURE_ITEM_MARGIN + safeAreaInsets.left,
        paddingRight: PICTURE_ITEM_MARGIN + safeAreaInsets.right,
      }}
    />
  )
}

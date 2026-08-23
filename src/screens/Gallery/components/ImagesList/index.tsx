import type { LegendListRenderItemProps } from '@legendapp/list/react-native'
import { LegendList } from '@legendapp/list/react-native'
import { memo, useCallback, useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  ErrorLoadingList,
  ErrorLoadingMoreItems,
  LoadingMoreItems,
} from '@components'
import { Namespaces, useLocale } from '@locale'
import type { PictureAction } from '@routes'
import { useScreenParams } from '@routes'
import {
  EmptyImagesList,
  ImageItem,
  LoadingImagesList,
  NoImagesListPermission,
  useImageItemSize,
} from './components'
import type { ImageResource } from './hooks'
import {
  ImagesListStatus,
  useGalleryColumnCount,
  useImagesCountToLoad,
  useImagesList,
  useImagesRowCountInList,
} from './hooks'


export type { ImageResource } from './hooks'


interface ExtraData {
  importSingleImage: (imageResource: ImageResource) => Promise<void>
  selectItem: (imageResource: ImageResource) => void
  deselectItem: (imageResource: ImageResource) => void
  isItemSelected: (imageResource: ImageResource) => boolean
  isSelectionMode: boolean
  action: PictureAction
  imageItemSize: number
}


interface ImagesListProps {
  selectItem: (imageResource: ImageResource) => void
  deselectItem: (imageResource: ImageResource) => void
  isItemSelected: (imageResource: ImageResource) => boolean
  isSelectionMode: boolean
  getSelectedData: () => ImageResource[]
  importSingleImage: (imageResource: ImageResource) => Promise<void>
}


export const ImagesList = memo((props: ImagesListProps) => {


  const params = useScreenParams<'Gallery'>()
  const safeAreaInsets = useSafeAreaInsets()

  const { t } = useLocale()

  const columnCount = useGalleryColumnCount()
  const imageItemSize = useImageItemSize()
  const imagesRowCountInList = useImagesRowCountInList()
  const imagesCountToLoad = useImagesCountToLoad()
  const imagesList = useImagesList(imagesCountToLoad)
  const isImagesListRefreshing = (
    imagesList.status === ImagesListStatus.IS_REFRESHING
  )


  const renderItem = useCallback(
    (info: LegendListRenderItemProps<ImageResource>) => {
      // TODO: Check if is required to replace inline functions with useCallback
      // TODO: Update react-native-selection-mode to allow passing the functions
      // to the component and the useSelectableItem passes the value to these
      // functions

      const imagePath = info.item
      const extraData = info.extraData as ExtraData

      return (
        <ImageItem
          onClick={async () => await extraData.importSingleImage(imagePath)}
          onSelect={() => extraData.selectItem(imagePath)}
          onDeselect={() => extraData.deselectItem(imagePath)}
          isSelectionMode={extraData.isSelectionMode}
          isSelected={extraData.isItemSelected(imagePath)}
          item={imagePath}
          action={extraData.action}
          imageItemSize={extraData.imageItemSize}
        />
      )
    },
    [],
  )

  const extraData = useMemo<ExtraData>(() => {
    return {
      importSingleImage: props.importSingleImage,
      selectItem: props.selectItem,
      deselectItem: props.deselectItem,
      isSelectionMode: props.isSelectionMode,
      isItemSelected: props.isItemSelected,
      action: params.action,
      imageItemSize,
    }
  }, [
    props.importSingleImage,
    props.selectItem,
    props.deselectItem,
    props.isSelectionMode,
    props.isItemSelected,
    params.action,
    imageItemSize,
  ])

  const keyExtractor = useCallback((item: ImageResource) => {
    return item.uri
  }, [])

  const getFixedItemSize = useCallback(() => {
    return imageItemSize
  }, [imageItemSize])

  const onEndReached = useCallback(async () => {
    const galleryLength = imagesList.images.length
    const currentRowAmount = (galleryLength / columnCount)
    if (currentRowAmount < imagesRowCountInList) {
      return
    }

    await imagesList.loadMoreImages()
  }, [
    imagesList.images,
    columnCount,
    imagesRowCountInList,
    imagesList.loadMoreImages,
  ])

  const ListFooterComponent = useCallback(() => {
    if (imagesList.status === ImagesListStatus.IS_LOADING_MORE) {
      return <LoadingMoreItems />
    }

    if (imagesList.status === ImagesListStatus.HAS_ERROR_LOADING_MORE) {
      return (
        <ErrorLoadingMoreItems
          title={t(
            'Gallery_errorLoadingMoreImages_title',
            { ns: Namespaces.APP },
          )}
          tryAgain={imagesList.loadMoreImages}
        />
      )
    }

    return null
  }, [imagesList.status, t, imagesList.loadMoreImages])


  if (imagesList.status === ImagesListStatus.IS_LOADING) {
    return <LoadingImagesList />
  }

  if (imagesList.status === ImagesListStatus.NO_PERMISSION) {
    return <NoImagesListPermission />
  }

  if (imagesList.status === ImagesListStatus.HAS_ERROR_LOADING) {
    return (
      <ErrorLoadingList
        description={t(
          'Gallery_errorLoadingImages_text',
          { ns: Namespaces.APP },
        )}
        tryAgain={imagesList.loadImages}
      />
    )
  }

  if (imagesList.status === ImagesListStatus.IS_EMPTY) {
    return <EmptyImagesList />
  }

  return (
    <LegendList
      data={imagesList.images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      recycleItems={true}
      estimatedItemSize={imageItemSize}
      getFixedItemSize={getFixedItemSize}
      extraData={extraData}
      numColumns={columnCount}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      ListFooterComponent={ListFooterComponent}
      refreshing={isImagesListRefreshing}
      onRefresh={imagesList.refreshImages}
      contentContainerStyle={{
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      }}
    />
  )
})

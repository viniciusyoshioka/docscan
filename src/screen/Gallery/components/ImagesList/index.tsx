import { useRoute } from "@react-navigation/native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { memo, useCallback, useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ErrorLoadingList, ErrorLoadingMoreItems, LoadingMoreItems } from "@components"
import { translate } from "@locales"
import { RouteProps } from "@router"
import {
  EmptyImagesList,
  ImageItem,
  LoadingImagesList,
  NoImagesListPermission,
  useImageItemSize,
} from "./components"
import {
  ImagesListStatus,
  useGalleryColumnCount,
  useImagesCountToLoad,
  useImagesList,
  useImagesRowCountInList,
} from "./hooks"


interface ImagesListProps {
  selectItem: (imagePath: string) => void
  deselectItem: (imagePath: string) => void
  isItemSelected: (imagePath: string) => boolean
  isSelectionMode: boolean
  getSelectedData: () => string[]
  importImages: (imagesPath: string[]) => Promise<void>
}


export const ImagesList = memo((props: ImagesListProps) => {


  const { params } = useRoute<RouteProps<"Gallery">>()
  const safeAreaInsets = useSafeAreaInsets()

  const columnCount = useGalleryColumnCount()
  const imageItemSize = useImageItemSize()
  const imagesRowCountInList = useImagesRowCountInList()
  const imagesCountToLoad = useImagesCountToLoad()
  const imagesList = useImagesList(imagesCountToLoad)


  const importSingleImage = useCallback(async (imagePath: string) => {
    await props.importImages([imagePath])
  }, [props.importImages])

  const renderItem: ListRenderItem<string> = useCallback(({ item }) => {
    // TODO: Check if is required to replace inline functions with useCallback
    // TODO: Update react-native-selection-mode to allow passing the functions to the component
    // and the useSelectableItem passes the value to these funcions
    return (
      <ImageItem
        onClick={async () => await props.importImages([item])}
        onSelect={() => props.selectItem(item)}
        onDeselect={() => props.deselectItem(item)}
        isSelectionMode={props.isSelectionMode}
        isSelected={props.isItemSelected(item)}
        imagePath={item}
        action={params.action}
        imageItemSize={imageItemSize}
      />
    )
  }, [
    importSingleImage,
    props.selectItem,
    props.deselectItem,
    props.isSelectionMode,
    props.isItemSelected,
    params.action,
    imageItemSize,
  ])

  const extraData = useMemo(() => {
    return [renderItem]
  }, [renderItem])

  const keyExtractor = useCallback((item: string) => {
    return item
  }, [])

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
          title={translate("Gallery_errorLoadingMoreImages_title")}
          tryAgain={imagesList.loadMoreImages}
        />
      )
    }

    return null
  }, [imagesList.status, imagesList.loadMoreImages])


  if (imagesList.status === ImagesListStatus.IS_LOADING) {
    return <LoadingImagesList />
  }

  if (imagesList.status === ImagesListStatus.NO_PERMISSION) {
    return <NoImagesListPermission />
  }

  if (imagesList.status === ImagesListStatus.HAS_ERROR_LOADING) {
    return (
      <ErrorLoadingList
        description={translate("Gallery_errorLoadingImages_text")}
        tryAgain={imagesList.loadImages}
      />
    )
  }

  if (imagesList.status === ImagesListStatus.IS_EMPTY) {
    return <EmptyImagesList />
  }


  return (
    <FlashList
      data={imagesList.images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={extraData}
      estimatedItemSize={imageItemSize}
      numColumns={columnCount}
      onEndReachedThreshold={0.05}
      onEndReached={onEndReached}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={{
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      }}
    />
  )
})

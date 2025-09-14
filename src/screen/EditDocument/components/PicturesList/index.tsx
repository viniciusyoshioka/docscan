import { useNavigation } from "@react-navigation/native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { useCallback, useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ErrorLoadingList, ErrorLoadingMoreItems, LoadingMoreItems } from "@components"
import { PictureDTO } from "@database"
import { useDocumentState } from "@libs/document-state"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { PictureUtils } from "@utils"
import {
  EmptyPictures,
  LoadingPictures,
  PICTURE_ITEM_MARGIN,
  PictureItem,
  usePictureItemSize,
} from "./components"
import {
  PicturesListStatus,
  usePicturesColumnCount,
  usePicturesCountToLoad,
  usePicturesList,
} from "./hooks"


interface PicturesListProps {
  isSelectionMode: boolean
  selectItem: (id: string) => void
  deselectItem: (id: string) => void
  isItemSelected: (id: string) => boolean
}


export function PicturesList(props: PicturesListProps) {


  const navigation = useNavigation<NavigationProps<"EditDocument">>()
  const safeAreaInsets = useSafeAreaInsets()

  const { documentState } = useDocumentState()

  const columnCount = usePicturesColumnCount()
  const pictureItemSize = usePictureItemSize()
  const picturesCountToLoad = usePicturesCountToLoad()
  const picturesList = usePicturesList(documentState?.document.id, picturesCountToLoad)


  const visualizePicture = useCallback((pictureIndex: number) => {
    navigation.navigate("VisualizePicture", { pictureIndex })
  }, [navigation])

  const renderItem: ListRenderItem<PictureDTO> = useCallback(({ item, index }) => {
    // TODO: Check if is required to replace inline functions with useCallback
    // TODO: Update react-native-selection-mode to allow passing the functions to the component
    // and the useSelectableItem passes the value to these funcions
    return (
      <PictureItem
        onClick={() => visualizePicture(index)}
        isSelectionMode={props.isSelectionMode}
        onSelect={() => props.selectItem(item.id)}
        onDeselect={() => props.deselectItem(item.id)}
        isSelected={props.isItemSelected(item.id)}
        picturePath={PictureUtils.getPicturePathForFileName(item.fileName)}
        pictureItemSize={pictureItemSize}
      />
    )
  }, [
    visualizePicture,
    props.isSelectionMode,
    props.selectItem,
    props.deselectItem,
    props.isItemSelected,
    pictureItemSize,
  ])

  const keyExtractor = useCallback((item: PictureDTO): string => {
    return item.id
  }, [])

  const extraData = useMemo(() => {
    return [renderItem]
  }, [renderItem])

  const ListFooterComponent = useCallback(() => {
    if (picturesList.status === PicturesListStatus.IS_LOADING_MORE) {
      return <LoadingMoreItems />
    }

    if (picturesList.status === PicturesListStatus.HAS_ERROR_LOADING_MORE) {
      return (
        <ErrorLoadingMoreItems
          title={translate("EditDocument_errorLoadingMorePictures_title")}
          tryAgain={picturesList.loadMorePictures}
        />
      )
    }

    return null
  }, [picturesList.status, picturesList.loadMorePictures])


  if (picturesList.status === PicturesListStatus.IS_LOADING) {
    return <LoadingPictures />
  }

  if (picturesList.status === PicturesListStatus.HAS_ERROR) {
    return (
      <ErrorLoadingList
        description={translate("EditDocument_errorLoadingPictures_text")}
        tryAgain={picturesList.loadPictures}
      />
    )
  }

  if (picturesList.status === PicturesListStatus.IS_EMPTY) {
    return <EmptyPictures />
  }

  return (
    <FlashList
      data={documentState?.pictures ?? []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={extraData}
      numColumns={columnCount}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={{
        padding: PICTURE_ITEM_MARGIN,
        paddingLeft: PICTURE_ITEM_MARGIN + safeAreaInsets.left,
        paddingRight: PICTURE_ITEM_MARGIN + safeAreaInsets.right,
      }}
    />
  )
}

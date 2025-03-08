import { useNavigation } from "@react-navigation/native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { useCallback, useMemo } from "react"
import { Divider } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ErrorLoadingList, ErrorLoadingMoreItems, LoadingMoreItems } from "@components"
import { DocumentDTO } from "@database"
import { useDocumentState } from "@libs/document-state"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { DocumentStatus } from "../../hooks"
import { DOCUMENT_ITEM_HEIGHT, DocumentItem, EmptyDocuments, LoadingDocuments } from "./components"
import { FAB_HEIGHT, FAB_PADDING_VERTICAL } from "./constants"


export { DOCUMENT_ITEM_HEIGHT } from "./components"


interface DocumentsListProps {
  status: DocumentStatus
  data: DocumentDTO[]
  error?: Error
  loadDocuments: () => Promise<void>
  loadMoreDocuments: () => Promise<void>

  selectItem: (id: string) => void
  deselectItem: (id: string) => void
  isItemSelected: (id: string) => boolean
  isSelectionMode: boolean
}


export function DocumentsList(props: DocumentsListProps) {


  const navigation = useNavigation<NavigationProps<"Home">>()
  const safeAreaInsets = useSafeAreaInsets()

  const { updateDocumentState } = useDocumentState()


  const openDocument = useCallback((document: DocumentDTO) => {
    updateDocumentState({
      type: "openDocument",
      payload: {
        document,
      },
    })

    navigation.navigate("EditDocument")
  }, [updateDocumentState, navigation])

  const renderItem: ListRenderItem<DocumentDTO> = useCallback(({ item }) => {
    // TODO: Check if is required to replace inline functions with useCallback
    // TODO: Update react-native-selection-mode to allow passing the functions to the component
    // and the useSelectableItem passes the value to these funcions
    return (
      <DocumentItem
        onClick={() => openDocument(item)}
        onSelect={() => props.selectItem(item.id)}
        onDeselect={() => props.deselectItem(item.id)}
        isSelectionMode={props.isSelectionMode}
        isSelected={props.isItemSelected(item.id)}
        document={item}
      />
    )
  }, [
    openDocument,
    props.selectItem,
    props.deselectItem,
    props.isSelectionMode,
    props.isItemSelected,
  ])

  const keyExtractor = useCallback((item: DocumentDTO) => {
    return item.id
  }, [])

  const extraData = useMemo(() => {
    return [renderItem]
  }, [renderItem])

  const ItemSeparatorComponent = useCallback(() => {
    return <Divider style={{ marginHorizontal: 16 }} />
  }, [])

  const ListFooterComponent = useCallback(() => {
    if (props.status === DocumentStatus.IS_LOADING_MORE) {
      return <LoadingMoreItems />
    }

    if (props.status === DocumentStatus.HAS_ERROR_LOADING_MORE) {
      return (
        <ErrorLoadingMoreItems
          title={translate("Home_errorLoadingMoreDocuments_title")}
          tryAgain={props.loadMoreDocuments}
        />
      )
    }

    return null
  }, [props.status, props.loadMoreDocuments])


  if (props.status === DocumentStatus.IS_LOADING) {
    return <LoadingDocuments />
  }

  if (props.status === DocumentStatus.HAS_ERROR) {
    return (
      <ErrorLoadingList
        description={translate("Home_errorLoadingDocuments_text")}
        tryAgain={props.loadDocuments}
      />
    )
  }

  if (props.status === DocumentStatus.IS_EMPTY) {
    return <EmptyDocuments />
  }

  return (
    <FlashList
      data={props.data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={extraData}
      estimatedItemSize={DOCUMENT_ITEM_HEIGHT}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={{
        paddingBottom: (FAB_PADDING_VERTICAL * 2) + FAB_HEIGHT + safeAreaInsets.bottom,
      }}
    />
  )
}

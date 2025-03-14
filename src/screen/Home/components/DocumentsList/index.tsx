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


interface ExtraData {
  openDocument: (document: DocumentDTO) => void
  selectItem: (id: string) => void
  deselectItem: (id: string) => void
  isItemSelected: (id: string) => boolean
  isSelectionMode: boolean
}


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

  const renderItem: ListRenderItem<DocumentDTO> = useCallback(info => {
    // TODO: Check if is required to replace inline functions with useCallback
    // TODO: Update react-native-selection-mode to allow passing the functions to the component
    // and the useSelectableItem passes the value to these funcions

    const document = info.item
    const extraData = info.extraData as ExtraData

    return (
      <DocumentItem
        onClick={() => extraData.openDocument(document)}
        onSelect={() => extraData.selectItem(document.id)}
        onDeselect={() => extraData.deselectItem(document.id)}
        isSelectionMode={extraData.isSelectionMode}
        isSelected={extraData.isItemSelected(document.id)}
        document={document}
      />
    )
  }, [])

  const keyExtractor = useCallback((item: DocumentDTO) => {
    return item.id
  }, [])

  const extraData = useMemo<ExtraData>(() => {
    return {
      openDocument,
      selectItem: props.selectItem,
      deselectItem: props.deselectItem,
      isSelectionMode: props.isSelectionMode,
      isItemSelected: props.isItemSelected,
    }
  }, [
    openDocument,
    props.selectItem,
    props.deselectItem,
    props.isSelectionMode,
    props.isItemSelected,
  ])

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

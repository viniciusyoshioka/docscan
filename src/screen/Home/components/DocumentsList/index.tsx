import { useNavigation } from "@react-navigation/native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { useCallback } from "react"
import { ActivityIndicator, Divider } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { DocumentDTO } from "@database"
import { NavigationProps } from "@router"
import { DOCUMENT_ITEM_HEIGHT, DocumentItem } from "./DocumentItem"
import { EmptyDocuments } from "./EmptyDocuments"
import { LoadingDocuments } from "./LoadingDocuments"
import { useDocumentsListStatus } from "./useDocumentsListStatus"


const FAB_PADDING_VERTICAL = 16
const FAB_HEIGHT = 56


export interface DocumentsListProps {
  isLoading: boolean
  data: DocumentDTO[]
  error?: Error

  selectItem: (id: string) => void
  deselectItem: (id: string) => void
  isItemSelected: (id: string) => boolean
  isSelectionMode: boolean
  getSelectedData: () => string[]
}


// TODO: Handle error state
export function DocumentsList(props: DocumentsListProps) {


  const navigation = useNavigation<NavigationProps<"Home">>()
  const safeAreaInsets = useSafeAreaInsets()

  const documentsListStatus = useDocumentsListStatus({
    isLoading: props.isLoading,
    data: props.data,
    error: props.error,
  })

  const openDocument = useCallback((document: DocumentDTO) => {
    // TODO: Set document and pictures to state before navigating
    navigation.navigate("EditDocument")
  }, [navigation])

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

  const ItemSeparatorComponent = useCallback(() => {
    return <Divider style={{ marginHorizontal: 16 }} />
  }, [])

  const ListFooterComponent = useCallback(() => {
    if (documentsListStatus !== "isLoadingMore") {
      return null
    }

    return <ActivityIndicator size={"small"} style={{ margin: 16 }} />
  }, [documentsListStatus])


  if (documentsListStatus === "isLoading") {
    return <LoadingDocuments />
  }

  if (documentsListStatus === "isEmpty") {
    return <EmptyDocuments />
  }

  return (
    <FlashList
      data={props.data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      extraData={props.getSelectedData()}
      estimatedItemSize={DOCUMENT_ITEM_HEIGHT}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={{
        paddingBottom: (FAB_PADDING_VERTICAL * 2) + FAB_HEIGHT + safeAreaInsets.bottom,
      }}
    />
  )
}

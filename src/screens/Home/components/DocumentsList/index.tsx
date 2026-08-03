import { LegendList, type LegendListRenderItemProps } from '@legendapp/list/react-native'
import { useCallback, useMemo } from 'react'
import { Divider } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ErrorLoadingList, ErrorLoadingMoreItems, LoadingMoreItems } from '@components'
import type { DocumentEntity, DocumentId } from '@database'
import { Namespaces, useLocale } from '@locale'
import { useDocumentState } from '@modules/document-state'
import { DocumentStatus, useGoToDocumentDetailScreen } from '../../hooks'
import { DocumentItem, EmptyDocuments, LoadingDocuments } from './components'
import { FAB_HEIGHT, FAB_PADDING_VERTICAL } from './constants'


export { DOCUMENT_ITEM_HEIGHT } from './components'


interface ExtraData {
  openDocument: (document: DocumentEntity) => void
  selectItem: (id: DocumentId) => void
  deselectItem: (id: DocumentId) => void
  isItemSelected: (id: DocumentId) => boolean
  isSelectionMode: boolean
}


interface DocumentsListProps {
  status: DocumentStatus
  data: DocumentEntity[]
  error: Error | null
  loadDocuments: () => Promise<void>
  loadMoreDocuments: () => Promise<void>

  selectItem: (id: DocumentId) => void
  deselectItem: (id: DocumentId) => void
  isItemSelected: (id: DocumentId) => boolean
  isSelectionMode: boolean
}


export function DocumentsList(props: DocumentsListProps) {


  const safeAreaInsets = useSafeAreaInsets()

  const { t } = useLocale()
  const documentState = useDocumentState()

  const goToDocumentDetailScreen = useGoToDocumentDetailScreen()


  const openDocument = useCallback((document: DocumentEntity) => {
    documentState.setDocument(document)
    goToDocumentDetailScreen()
  }, [documentState, goToDocumentDetailScreen])

  const renderItem = useCallback(
    (info: LegendListRenderItemProps<DocumentEntity>) => {
      // TODO: Check if is required to replace inline functions with useCallback
      // TODO: Update react-native-selection-mode to allow passing the functions
      // to the component and the useSelectableItem passes the value to these
      // functions

      const document = info.item
      const extraData = info.extraData as ExtraData

      return (
        <DocumentItem
          onClick={() => extraData.openDocument(document)}
          onSelect={() => extraData.selectItem(document.id)}
          onDeselect={() => extraData.deselectItem(document.id)}
          isSelectionMode={extraData.isSelectionMode}
          isSelected={extraData.isItemSelected(document.id)}
          item={document}
        />
      )
    },
    [],
  )

  const keyExtractor = useCallback((item: DocumentEntity) => {
    return String(item.id)
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
          title={t(
            'Home_errorLoadingMoreDocuments_title',
            { ns: Namespaces.APP },
          )}
          tryAgain={props.loadMoreDocuments}
        />
      )
    }

    return null
  }, [props.status, t, props.loadMoreDocuments])

  const contentContainerStyle = useMemo(() => ({
    paddingBottom: (
      (FAB_PADDING_VERTICAL * 2) + FAB_HEIGHT + safeAreaInsets.bottom
    ),
  }), [safeAreaInsets.bottom])


  if (props.status === DocumentStatus.IS_LOADING) {
    return <LoadingDocuments />
  }

  if (props.status === DocumentStatus.HAS_ERROR) {
    return (
      <ErrorLoadingList
        description={t(
          'Home_errorLoadingDocuments_text',
          { ns: Namespaces.APP },
        )}
        tryAgain={props.loadDocuments}
      />
    )
  }

  if (props.status === DocumentStatus.IS_EMPTY) {
    return <EmptyDocuments />
  }

  return (
    <LegendList
      data={props.data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      recycleItems={true}
      extraData={extraData}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={contentContainerStyle}
    />
  )
}

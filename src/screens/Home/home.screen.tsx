import { View } from 'react-native'
import { FAB } from 'react-native-paper'
import { LoadingModal } from 'react-native-paper-towel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelectionMode } from 'react-native-selection-mode'

import { Header } from '@components'
import type { DocumentId } from '@database'
import { useBackHandler, useHideSplashscreen } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import { DocumentsList } from './components'
import {
  useDeleteSelectedDocuments,
  useDocumentList,
  useGoBack,
  useGoToCameraScreen,
  useHomeHeader,
  useRequestNotificationPermission,
} from './hooks'


export function Home() {


  const safeAreaInsets = useSafeAreaInsets()

  const { t } = useLocale()
  const hideSplashscreen = useHideSplashscreen(false)

  const documentSelection = useSelectionMode<DocumentId>()
  const documents = useDocumentList({
    onDocumentsLoaded: hideSplashscreen,
  })

  const goToCameraScreen = useGoToCameraScreen()

  const deleteSelectedDocuments = useDeleteSelectedDocuments({
    getSelectedDocumentIds: documentSelection.getSelectedData,
    onSuccess: documents.loadDocuments,
  })


  const goBack = useGoBack({
    hasBlockingModal: deleteSelectedDocuments.isLoading,
    isSelectionMode: documentSelection.isSelectionMode,
    exitSelection: documentSelection.exitSelection,
  })


  useRequestNotificationPermission()

  useBackHandler(goBack)


  const homeHeader = useHomeHeader({
    documents: documents.data,
    isSelectionMode: documentSelection.isSelectionMode,
    exitSelection: documentSelection.exitSelection,
    setSelectedData: documentSelection.setNewSelectedData,
    selectedDocumentsCount: documentSelection.getSelectedData().length,
    deleteSelectedDocuments: deleteSelectedDocuments.deleteSelectedDocuments,
  })


  return (
    <View style={{ flex: 1 }}>
      <Header
        isSelectionMode={documentSelection.isSelectionMode}
        onExitSelection={documentSelection.exitSelection}
        title={homeHeader.headerTitle}
        RightComponentSelectionMode={homeHeader.RightComponentSelectionMode}
        menuItems={homeHeader.menuItems}
        menuItemsSelectionMode={homeHeader.menuItemsSelectionMode}
      />

      <DocumentsList
        data={documents.data}
        status={documents.status}
        error={documents.error}
        loadDocuments={documents.loadDocuments}
        loadMoreDocuments={documents.loadMoreDocuments}
        selectItem={documentSelection.select}
        deselectItem={documentSelection.deselect}
        isItemSelected={documentSelection.isSelected}
        isSelectionMode={documentSelection.isSelectionMode}
      />

      <FAB
        icon={'plus'}
        mode={'flat'}
        style={{
          position: 'absolute',
          right: safeAreaInsets.right,
          bottom: safeAreaInsets.bottom,
          margin: 16,
        }}
        onPress={goToCameraScreen}
      />

      <LoadingModal
        visible={deleteSelectedDocuments.isLoading}
        message={t('Home_deletingDocuments', { ns: Namespaces.APP })}
      />
    </View>
  )
}

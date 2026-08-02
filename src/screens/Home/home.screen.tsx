import { useMemo } from 'react'
import { View } from 'react-native'
import { Appbar, FAB } from 'react-native-paper'
import { LoadingModal, useModal } from 'react-native-paper-towel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelectionMode } from 'react-native-selection-mode'

import { Header } from '@components'
import type { DocumentId } from '@database'
import { useBackHandler, useHideSplashscreen } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import { Info } from '@modules/info'
import {
  DeleteSelectedDocumentsModal,
  DocumentsList,
} from './components'
import {
  useDeleteDocuments,
  useDocumentList,
  useDuplicateDocuments,
  useExportDocuments,
  useGoBack,
  useGoToCameraScreen,
  useGoToSettingsScreen,
  useImportDocuments,
  useInvertDocumentSelection,
  useMergeDocuments,
  useRequestNotificationPermission,
  useShowErrorDeletingSelectedDocumentsAlert,
  useShowNotificationPermissionDeniedAlert,
} from './hooks'


export function Home() {


  const safeAreaInsets = useSafeAreaInsets()
  const documentSelection = useSelectionMode<DocumentId>()

  const { t } = useLocale()
  const hideSplashscreen = useHideSplashscreen(false)

  const documents = useDocumentList({
    onDocumentsLoaded: hideSplashscreen,
  })
  const deleteSelectedDocumentsModal = useModal()

  const showNotificationPermissionDeniedAlert =
    useShowNotificationPermissionDeniedAlert()
  const showErrorDeletingSelectedDocumentsAlert =
    useShowErrorDeletingSelectedDocumentsAlert()

  const goToCameraScreen = useGoToCameraScreen()
  const invertDocumentSelection = useInvertDocumentSelection({
    setSelectedData: documentSelection.setNewSelectedData,
    documents: documents.data,
  })
  const deleteDocuments = useDeleteDocuments({
    getSelectedDocumentIds: documentSelection.getSelectedData,
    onSuccess: async () => await documents.loadDocuments(),
    onError: showErrorDeletingSelectedDocumentsAlert,
  })
  const importDocuments = useImportDocuments()
  const exportDocuments = useExportDocuments()
  const mergeDocuments = useMergeDocuments()
  const duplicateDocuments = useDuplicateDocuments()
  const goToSettingsScreen = useGoToSettingsScreen()
  const goBack = useGoBack({
    hasBlockingModal:
      deleteDocuments.isLoading,
    isSelectionMode:
      documentSelection.isSelectionMode,
    exitSelection:
      documentSelection.exitSelection,
    isDeleteSelectedDocumentsModalVisible:
      deleteSelectedDocumentsModal.isVisible,
    hideDeleteSelectedDocumentsModal:
      deleteSelectedDocumentsModal.hide,
  })


  useRequestNotificationPermission({
    onPermissionDenied: showNotificationPermissionDeniedAlert,
  })

  useBackHandler(goBack)


  const headerTitle = documentSelection.isSelectionMode
    ? String(documentSelection.length)
    : Info.app.name

  const RightComponentSelectionMode = useMemo(() => (
    <>
      <Appbar.Action
        icon={'swap-horizontal'}
        onPress={invertDocumentSelection}
      />

      <Appbar.Action
        icon={'trash-can-outline'}
        onPress={deleteDocuments.deleteDocuments}
      />
    </>
  ), [invertDocumentSelection, deleteDocuments.deleteDocuments])

  const menuItems = useMemo(() => [
    {
      iconName: 'tray-arrow-down',
      title: t('Home_menu_importDocument', { ns: Namespaces.APP }),
      onPress: importDocuments,
    },
    {
      iconName: 'tray-arrow-up',
      title: t('Home_menu_exportDocument', { ns: Namespaces.APP }),
      onPress: exportDocuments,
    },
    {
      iconName: 'cog-outline',
      title: t('Home_menu_settings', { ns: Namespaces.APP }),
      onPress: goToSettingsScreen,
    },
  ], [t, importDocuments, exportDocuments, goToSettingsScreen])

  const menuItemsSelectionMode = useMemo(() => [
    {
      iconName: 'tray-arrow-up',
      title: t('Home_menu_exportDocument', { ns: Namespaces.APP }),
      onPress: exportDocuments,
    },
    {
      iconName: 'vector-combine',
      title: t('Home_menu_mergeDocument', { ns: Namespaces.APP }),
      onPress: mergeDocuments,
    },
    {
      iconName: 'content-duplicate',
      title: t('Home_menu_duplicateDocument', { ns: Namespaces.APP }),
      onPress: duplicateDocuments,
    },
  ], [t, exportDocuments, mergeDocuments, duplicateDocuments])


  return (
    <View style={{ flex: 1 }}>
      <Header
        isSelectionMode={documentSelection.isSelectionMode}
        onExitSelection={documentSelection.exitSelection}
        title={headerTitle}
        RightComponentSelectionMode={RightComponentSelectionMode}
        menuItems={menuItems}
        menuItemsSelectionMode={menuItemsSelectionMode}
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

      <DeleteSelectedDocumentsModal
        isVisible={deleteSelectedDocumentsModal.isVisible}
        onDismiss={deleteSelectedDocumentsModal.hide}
        deleteSelectedDocuments={deleteDocuments.deleteDocuments}
        exitSelection={documentSelection.exitSelection}
      />

      <LoadingModal
        visible={deleteDocuments.isLoading}
        message={t('Home_deletingDocuments', { ns: Namespaces.APP })}
      />
    </View>
  )
}

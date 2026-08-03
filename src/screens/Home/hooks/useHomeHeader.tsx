import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Appbar } from 'react-native-paper'
import type { SelectionMode } from 'react-native-selection-mode'

import type { MenuItems } from '@components'
import type { DocumentEntity, DocumentId } from '@database'
import { Namespaces, useLocale } from '@locale'
import { Info } from '@modules/info'
import { useDuplicateSelectedDocuments } from './useDuplicateSelectedDocuments.ts'
import { useExportDocuments } from './useExportDocuments.ts'
import { useGoToSettingsScreen } from './useGoToSettingsScreen.ts'
import { useImportDocuments } from './useImportDocuments.ts'
import { useInvertDocumentSelection } from './useInvertDocumentSelection.ts'
import { useMergeSelectedDocuments } from './useMergeSelectedDocuments.ts'
import { useShowDeleteSelectedDocumentsAlert } from './useShowDeleteSelectedDocumentsAlert.ts'


interface UseHomeHeaderParams {
  documents: DocumentEntity[]
  isSelectionMode: boolean
  exitSelection: () => void
  setSelectedData: SelectionMode<DocumentId>['setNewSelectedData']
  selectedDocumentsCount: number
  deleteSelectedDocuments: () => Promise<void>
}


interface UseHomeHeader {
  headerTitle?: string
  RightComponentSelectionMode?: ReactNode
  menuItems?: MenuItems
  menuItemsSelectionMode?: MenuItems
}


export function useHomeHeader(params: UseHomeHeaderParams): UseHomeHeader {
  const {
    documents,
    isSelectionMode,
    exitSelection,
    setSelectedData,
    selectedDocumentsCount,
    deleteSelectedDocuments,
  } = params


  const { t } = useLocale()


  const invertDocumentSelection = useInvertDocumentSelection({
    setSelectedData,
    documents,
  })

  const showDeleteSelectedDocumentsAlert = useShowDeleteSelectedDocumentsAlert({
    deleteSelectedDocuments,
    exitSelection,
  })

  const importDocuments = useImportDocuments()
  const exportDocuments = useExportDocuments()
  const mergeSelectedDocuments = useMergeSelectedDocuments()
  const duplicateDocuments = useDuplicateSelectedDocuments()
  const goToSettingsScreen = useGoToSettingsScreen()


  const headerTitle = isSelectionMode
    ? String(selectedDocumentsCount)
    : Info.app.name

  const RightComponentSelectionMode = useMemo(() => (
    <>
      <Appbar.Action
        icon={'swap-horizontal'}
        onPress={invertDocumentSelection}
      />

      <Appbar.Action
        icon={'trash-can-outline'}
        onPress={showDeleteSelectedDocumentsAlert}
      />
    </>
  ), [invertDocumentSelection, showDeleteSelectedDocumentsAlert])

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
      onPress: mergeSelectedDocuments,
    },
    {
      iconName: 'content-duplicate',
      title: t('Home_menu_duplicateDocument', { ns: Namespaces.APP }),
      onPress: duplicateDocuments,
    },
  ], [t, exportDocuments, mergeSelectedDocuments, duplicateDocuments])


  const homeHeader = useMemo<UseHomeHeader>(() => ({
    headerTitle,
    RightComponentSelectionMode,
    menuItems,
    menuItemsSelectionMode,
  }), [
    headerTitle,
    RightComponentSelectionMode,
    menuItems,
    menuItemsSelectionMode,
  ])


  return homeHeader
}

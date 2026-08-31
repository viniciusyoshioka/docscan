import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Appbar } from 'react-native-paper'
import type { SelectionMode } from 'react-native-selection-mode'

import type { MenuItems } from '@components'
import type { PictureId } from '@database'
import { Namespaces, useLocale } from '@locale'
import { useDocumentState } from '@modules/document-state'
import { useDeleteCurrentDocument } from './useDeleteCurrentDocument.ts'
import { useDeleteDocumentPdfFile } from './useDeleteDocumentPdfFile.ts'
import { useInvertPictureSelection } from './useInvertPictureSelection.ts'
import { useOpenCameraToAddPictures } from './useOpenCameraToAddPictures.ts'
import { useOpenConvertDocumentToPdfModal } from './useOpenConvertDocumentToPdfModal.ts'
import { useOpenRenameDocumentModal } from './useOpenRenameDocumentModal.ts'
import { useShareDocumentAsPdf } from './useShareDocumentAsPdf.ts'
import { useVisualizeDocumentPdfFile } from './useVisualizeDocumentPdfFile.ts'


interface UseDocumentDetailHeaderParams {
  isSelectionMode: boolean
  setSelectedData: SelectionMode<PictureId>['setNewSelectedData']
  selectedPicturesCount: number
  deleteSelectedPictures: () => void
}


interface UseDocumentDetailHeader {
  headerTitle?: string
  RightComponent?: ReactNode
  RightComponentSelectionMode?: ReactNode
  menuItems?: MenuItems
}


export function useDocumentDetailHeader(
  params: UseDocumentDetailHeaderParams,
): UseDocumentDetailHeader {
  const {
    isSelectionMode,
    setSelectedData,
    selectedPicturesCount,
    deleteSelectedPictures,
  } = params


  const { t } = useLocale()

  const { document, pictures } = useDocumentState()


  const openCameraToAddPictures = useOpenCameraToAddPictures()

  const invertPictureSelection = useInvertPictureSelection({
    pictures: pictures ?? [],
    setSelectedData,
  })

  const openConvertDocumentToPdfModal = useOpenConvertDocumentToPdfModal()
  const shareDocumentAsPdf = useShareDocumentAsPdf()
  const visualizeDocumentPdfFile = useVisualizeDocumentPdfFile()
  const openRenameDocumentModal = useOpenRenameDocumentModal()
  const deleteDocumentPdfFile = useDeleteDocumentPdfFile()
  const deleteCurrentDocument = useDeleteCurrentDocument()


  const headerTitle = isSelectionMode
    ? String(selectedPicturesCount)
    : document?.title

  const RightComponent = useMemo(() => (
    <>
      <Appbar.Action
        icon={'camera-plus-outline'}
        onPress={openCameraToAddPictures}
      />
    </>
  ), [openCameraToAddPictures])

  const RightComponentSelectionMode = useMemo(() => (
    <>
      <Appbar.Action
        icon={'swap-horizontal'}
        onPress={invertPictureSelection}
      />

      <Appbar.Action
        icon={'trash-can-outline'}
        onPress={deleteSelectedPictures}
      />
    </>
  ), [invertPictureSelection, deleteSelectedPictures])

  const menuItems = useMemo(() => [
    {
      iconName: 'file-pdf-box',
      title: t('DocumentDetail_menu_convertToPdf', { ns: Namespaces.APP }),
      onPress: openConvertDocumentToPdfModal,
    },
    {
      iconName: 'share-variant-outline',
      title: t('DocumentDetail_menu_sharePdf', { ns: Namespaces.APP }),
      onPress: shareDocumentAsPdf,
    },
    {
      iconName: 'open-in-new',
      title: t('DocumentDetail_menu_visualizePdf', { ns: Namespaces.APP }),
      onPress: visualizeDocumentPdfFile,
    },
    {
      iconName: 'rename-outline',
      title: t('DocumentDetail_menu_rename', { ns: Namespaces.APP }),
      onPress: openRenameDocumentModal,
    },
    {
      iconName: 'file-document-remove-outline',
      title: t('DocumentDetail_menu_deletePdf', { ns: Namespaces.APP }),
      onPress: deleteDocumentPdfFile.deleteDocumentPdfFile,
    },
    {
      iconName: 'trash-can-outline',
      title: t('DocumentDetail_menu_deleteDocument', { ns: Namespaces.APP }),
      onPress: deleteCurrentDocument.deleteCurrentDocument,
    },
  ], [
    t,
    openConvertDocumentToPdfModal,
    shareDocumentAsPdf,
    visualizeDocumentPdfFile,
    openRenameDocumentModal,
    deleteDocumentPdfFile,
    deleteCurrentDocument,
  ])


  const documentDetailHeader = useMemo<UseDocumentDetailHeader>(() => ({
    headerTitle,
    RightComponent,
    RightComponentSelectionMode,
    menuItems,
  }), [
    headerTitle,
    RightComponent,
    RightComponentSelectionMode,
    menuItems,
  ])


  return documentDetailHeader
}

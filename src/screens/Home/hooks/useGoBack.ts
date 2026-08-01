import { useCallback } from 'react'


interface GoBackParams {
  hasBlockingModal: boolean
  isSelectionMode: boolean
  exitSelection: () => void
  isDeleteSelectedDocumentsModalVisible: boolean
  hideDeleteSelectedDocumentsModal: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const goBack = useCallback(() => {
    if (params.hasBlockingModal) {
      return true
    }

    if (params.isDeleteSelectedDocumentsModalVisible) {
      params.hideDeleteSelectedDocumentsModal()
      return true
    }

    if (params.isSelectionMode) {
      params.exitSelection()
      return true
    }

    return false
  }, [
    params.hasBlockingModal,
    params.isDeleteSelectedDocumentsModalVisible,
    params.hideDeleteSelectedDocumentsModal,
    params.isSelectionMode,
    params.exitSelection,
  ])


  return goBack
}

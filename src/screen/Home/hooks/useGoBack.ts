import { useCallback } from "react"


interface GoBackParams {
  hasBlockingModal: boolean
  isSelectionMode: boolean
  exitSelection: () => void
  isNotificationPermissionDeniedModalVisible: boolean
  hideNotificationPermissionDeniedModal: () => void
  isDeleteSelectedDocumentsModalVisible: boolean
  hideDeleteSelectedDocumentsModal: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const goBack = useCallback(() => {
    if (params.hasBlockingModal) {
      return true
    }

    if (params.isNotificationPermissionDeniedModalVisible) {
      params.hideNotificationPermissionDeniedModal()
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
    params.isNotificationPermissionDeniedModalVisible,
    params.hideNotificationPermissionDeniedModal,
    params.isDeleteSelectedDocumentsModalVisible,
    params.hideDeleteSelectedDocumentsModal,
    params.isSelectionMode,
    params.exitSelection,
  ])


  return goBack
}

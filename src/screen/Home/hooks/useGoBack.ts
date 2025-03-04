import { useCallback } from "react"


interface GoBackParams {
  isSelectionMode: boolean
  exitSelection: () => void
  isNotificationPermissionDeniedModalVisible: boolean
  hideNotificationPermissionDeniedModal: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const goBack = useCallback(() => {
    if (params.isSelectionMode) {
      params.exitSelection()
      return true
    }

    if (params.isNotificationPermissionDeniedModalVisible) {
      params.hideNotificationPermissionDeniedModal()
      return true
    }

    return false
  }, [
    params.isSelectionMode,
    params.exitSelection,
    params.isNotificationPermissionDeniedModalVisible,
    params.hideNotificationPermissionDeniedModal,
  ])


  return goBack
}

import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"

import { NavigationProps } from "@router"


interface GoBackParams {
  isSelectionMode: boolean
  exitSelection: () => void
  isErrorImportingImagesModalVisible: boolean
  hideErrorImportingImagesModal: () => void
}


export function useGoBack(params: GoBackParams) {


  const navigation = useNavigation<NavigationProps<"Gallery">>()


  const goBack = useCallback((): boolean => {
    if (params.isSelectionMode) {
      params.exitSelection()
      return true
    }

    if (params.isErrorImportingImagesModalVisible) {
      params.hideErrorImportingImagesModal()
      return true
    }

    navigation.goBack()
    return true
  }, [
    params.isSelectionMode,
    params.exitSelection,
    params.isErrorImportingImagesModalVisible,
    params.hideErrorImportingImagesModal,
    navigation.goBack,
  ])


  return goBack
}

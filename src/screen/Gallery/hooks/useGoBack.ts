import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"

import { NavigationProps } from "@router"


interface GoBackParams {
  isSelectionMode: boolean
  exitSelection: () => void
  isErrorImportingImagesModalVisible: boolean
  hideErrorImportingImagesModal: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const navigation = useNavigation<NavigationProps<"Gallery">>()


  const goBack = useCallback((): boolean => {
    if (params.isErrorImportingImagesModalVisible) {
      params.hideErrorImportingImagesModal()
      return true
    }

    if (params.isSelectionMode) {
      params.exitSelection()
      return true
    }

    navigation.goBack()
    return true
  }, [
    params.isErrorImportingImagesModalVisible,
    params.hideErrorImportingImagesModal,
    params.isSelectionMode,
    params.exitSelection,
    navigation.goBack,
  ])


  return goBack
}

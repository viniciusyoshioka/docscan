import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"

import { useDocumentState } from "@libs/document-state"
import { NavigationProps } from "@router"


interface GoBackParams {
  isSelectionMode: boolean
  exitSelection: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const navigation = useNavigation<NavigationProps<"EditDocument">>()

  const { updateDocumentState } = useDocumentState()


  const goBack = useCallback(() => {
    if (params.isSelectionMode) {
      params.exitSelection()
      return true
    }

    updateDocumentState({
      type: "close",
      payload: undefined,
    })

    navigation.goBack()
    return true
  }, [
    params.isSelectionMode,
    params.exitSelection,
    updateDocumentState,
    navigation,
  ])


  return goBack
}

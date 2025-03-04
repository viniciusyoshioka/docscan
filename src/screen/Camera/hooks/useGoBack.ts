import { useNavigation, useRoute } from "@react-navigation/native"
import { useCallback } from "react"

import { useDocumentState } from "@libs/document-state"
import { NavigationProps, RouteProps } from "@router"


interface GoBackParams {
  isSettingsVisible: boolean
  hideSettings: () => void
}


export function useGoBack(goBackParams: GoBackParams) {
  const { isSettingsVisible, hideSettings } = goBackParams


  const navigation = useNavigation<NavigationProps<"Camera">>()
  const { params } = useRoute<RouteProps<"Camera">>()

  const { updateDocumentState } = useDocumentState()


  const goBack = useCallback((): boolean => {
    if (isSettingsVisible) {
      hideSettings()
      return true
    }

    if (params?.action === "replace-picture") {
      navigation.navigate("VisualizePicture", {
        pictureIndex: params.replaceIndex,
      })
      return true
    }

    if (params?.action === "add-picture") {
      navigation.navigate("EditDocument")
      return true
    }

    updateDocumentState({
      type: "close",
      payload: undefined,
    })
    navigation.goBack()
    return true
  }, [isSettingsVisible, hideSettings, params, navigation, updateDocumentState])


  return goBack
}

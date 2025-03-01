import { useNavigation, useRoute } from "@react-navigation/native"
import { useCallback } from "react"

import { NavigationProps, RouteProps } from "@router"


interface GoBackParams {
  isSettingsVisible: boolean
  hideSettings: () => void
}


export function useGoBack(goBackParams: GoBackParams) {
  const { isSettingsVisible, hideSettings } = goBackParams


  const navigation = useNavigation<NavigationProps<"Camera">>()
  const { params } = useRoute<RouteProps<"Camera">>()


  const goBack = useCallback((): boolean => {
    if (isSettingsVisible) {
      hideSettings()
      return true
    }

    const screenAction = params?.action
    if (screenAction === undefined) {
      // TODO: Empty document state before leaving screen
    }

    navigation.goBack()
    return true
  }, [isSettingsVisible, hideSettings, params, navigation])


  return goBack
}

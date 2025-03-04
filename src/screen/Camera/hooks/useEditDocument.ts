import { useNavigation, useRoute } from "@react-navigation/native"
import { useCallback } from "react"

import { NavigationProps, RouteProps } from "@router"


export function useEditDocument() {


  const navigation = useNavigation<NavigationProps<"Camera">>()
  const { params } = useRoute<RouteProps<"Camera">>()


  const editDocument = useCallback(() => {
    if (params?.action === "add-picture") {
      navigation.goBack()
    } else {
      navigation.replace("EditDocument")
    }
  }, [params, navigation])


  return editDocument
}

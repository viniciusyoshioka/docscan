import { useNavigation, useRoute } from "@react-navigation/native"
import { useCallback } from "react"

import { NavigationProps, RouteProps } from "@router"


export function useAddPictureFromGallery() {


  const navigation = useNavigation<NavigationProps<"Camera">>()
  const { params } = useRoute<RouteProps<"Camera">>()


  const addPictureFromGallery = useCallback(() => {
    if (params?.action === "replace-picture") {
      navigation.navigate("Gallery", {
        action: params.action,
        replaceIndex: params.replaceIndex,
      })
      return
    }

    navigation.navigate("Gallery", {
      action: "add-picture",
    })
  }, [navigation, params])


  return addPictureFromGallery
}

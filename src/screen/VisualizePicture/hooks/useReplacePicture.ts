import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"

import { NavigationProps } from "@router"


type ReplacePicture = () => void


export function useReplacePicture(pictureIndex: number): ReplacePicture {


  const navigation = useNavigation<NavigationProps<"VisualizePicture">>()


  const replacePicture = useCallback(() => {
    navigation.navigate("Camera", {
      action: "replace-picture",
      replaceIndex: pictureIndex,
    })
  }, [navigation, pictureIndex])


  return replacePicture
}

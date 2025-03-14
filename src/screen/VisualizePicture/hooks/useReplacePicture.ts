import { useNavigation } from "@react-navigation/native"

import { NavigationProps } from "@router"


type ReplacePicture = () => void


export function useReplacePicture(pictureIndex: number): ReplacePicture {


  const navigation = useNavigation<NavigationProps<"VisualizePicture">>()


  function replacePicture() {
    navigation.navigate("Camera", {
      action: "replace-picture",
      replaceIndex: pictureIndex,
    })
  }


  return replacePicture
}

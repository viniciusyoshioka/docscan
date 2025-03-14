import { useNavigation } from "@react-navigation/native"

import { NavigationProps } from "@router"


interface GoBackParams {
  isRotating: boolean
  exitRotation: () => void
  isCropping: boolean
  exitCrop: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const navigation = useNavigation<NavigationProps<"VisualizePicture">>()


  function goBack() {
    if (params.isRotating) {
      params.exitRotation()
      return true
    }
    if (params.isCropping) {
      params.exitCrop()
      return true
    }

    navigation.goBack()
    return true
  }


  return goBack
}

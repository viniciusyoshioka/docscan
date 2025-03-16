import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"

import { NavigationProps } from "@router"


type GoBack = () => boolean


export function useGoBack(): GoBack {


  const navigation = useNavigation<NavigationProps<"Settings">>()


  const goBack = useCallback((): boolean => {
    navigation.navigate("Home")
    return true
  }, [navigation])


  return goBack
}

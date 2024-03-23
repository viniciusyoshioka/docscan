import { useEffect } from "react"
import { BackHandler } from "react-native"


export type BackhandlerCallback = (() => boolean | null | undefined)


export function useBackHandler(backhandlerFunction: BackhandlerCallback) {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backhandlerFunction
    )

    return () => subscription.remove()
  })
}

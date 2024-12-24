import { useEffect } from "react"
import { BackHandler } from "react-native"


export type BackHandlerCallback = (() => boolean | null | undefined)


export function useBackHandler(backHandlerFunction: BackHandlerCallback) {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandlerFunction
    )

    return () => subscription.remove()
  })
}

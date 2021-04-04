import { useEffect } from "react"
import { BackHandler } from "react-native"


export function useBackHandler(backhandlerFunction: () => boolean) {
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backhandlerFunction)
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backhandlerFunction)
        }
    })
}

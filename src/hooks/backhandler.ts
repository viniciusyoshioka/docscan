import { useEffect } from "react"
import { BackHandler } from "react-native"


/**
 * Hook to add BackHandler events
 *
 * @param backhandlerFunction a function that returns
 * a boolean, null or undefined.
 * A false value means that the BackHandler will use
 * the default behavior, and a true one, that it will
 * override it
 */
export function useBackHandler(backhandlerFunction: () => boolean | null | undefined) {
    useEffect(() => {
        const subscription = BackHandler.addEventListener("hardwareBackPress", backhandlerFunction)
        return () => subscription.remove()
    })
}

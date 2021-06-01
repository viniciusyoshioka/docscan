import { useEffect } from "react"
import { BackHandler, Keyboard, KeyboardEventName } from "react-native"


export function useBackHandler(backhandlerFunction: () => boolean) {
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backhandlerFunction)
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backhandlerFunction)
        }
    })
}


export function useKeyboard(eventName: KeyboardEventName, keyboardFunction: () => void) {
    useEffect(() => {
        Keyboard.addListener(eventName, keyboardFunction)
        return () => {
            Keyboard.removeListener(eventName, keyboardFunction)
        }
    })
}

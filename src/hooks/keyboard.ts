import { useEffect } from "react"
import { Keyboard, KeyboardEventListener, KeyboardEventName } from "react-native"


/**
 * Hook to add Keyboard events
 * 
 * @param eventName the name of the event to listen to
 * @param keyboardFunction the function to be executed when the event is triggered
 */
export function useKeyboard(eventName: KeyboardEventName, keyboardFunction: KeyboardEventListener) {
    useEffect(() => {
        const subscription = Keyboard.addListener(eventName, keyboardFunction)
        return () => subscription.remove()
    })
}

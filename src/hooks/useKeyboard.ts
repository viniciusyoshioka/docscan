import { useEffect } from 'react'
import type {
  KeyboardEventListener as RNKeyboardEventListener,
  KeyboardEventName as RNKeyboardEventName,
} from 'react-native'
import { Keyboard } from 'react-native'


export type KeyboardEventName = RNKeyboardEventName

export type KeyboardEventListener = RNKeyboardEventListener


export function useKeyboard(
  eventName: KeyboardEventName,
  keyboardFunction: KeyboardEventListener,
) {
  useEffect(() => {
    const subscription = Keyboard.addListener(eventName, keyboardFunction)
    return () => subscription.remove()
  }, [eventName, keyboardFunction])
}

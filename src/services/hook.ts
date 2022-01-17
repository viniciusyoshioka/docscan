import { useEffect, useState } from "react"
import { AppState, AppStateStatus, BackHandler, Keyboard, KeyboardEventListener, KeyboardEventName } from "react-native"
import OrientationLocker, { OrientationType } from "react-native-orientation-locker"


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


/**
 * @returns boolean indicating if app is in foreground
 */
export function useIsForeground(): boolean {
    const [isForeground, setIsForeground] = useState(true)

    useEffect(() => {
        function onChangeAppState(state: AppStateStatus) {
            setIsForeground(state === "active")
        }

        const subscription = AppState.addEventListener("change", onChangeAppState)
        return () => subscription.remove()
    })

    return isForeground
}


/**
 * Hook to add and remove the device orientation listener
 * 
 * @returns New device orientation
 */
export function useDeviceOrientationChange(): OrientationType {
    const [orientation, setOrientation] = useState(OrientationLocker.getInitialOrientation())

    useEffect(() => {
        function onDeviceOrientationChange(deviceOrientation: OrientationType) {
            setOrientation(deviceOrientation)
        }

        OrientationLocker.addDeviceOrientationListener(onDeviceOrientationChange)
        return () => {
            OrientationLocker.removeDeviceOrientationListener(onDeviceOrientationChange)
        }
    })

    return orientation
}

import { useEffect, useState } from "react"
import { AppState, AppStateStatus } from "react-native"


export function useIsForeground(): boolean {
    const [isForeground, setIsForeground] = useState(AppState.currentState === "active")

    useEffect(() => {
        function onChangeAppState(state: AppStateStatus) {
            setIsForeground(state === "active")
        }

        const subscription = AppState.addEventListener("change", onChangeAppState)
        return () => subscription.remove()
    })

    return isForeground
}

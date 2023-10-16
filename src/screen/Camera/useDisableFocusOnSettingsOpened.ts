import { useEffect } from "react"


export interface DisableFocusOnSettingsOpened {
    isSettingsOpened: boolean
    setIsFocusEnabled: (enabled: boolean) => void
}


export function useDisableFocusOnSettingsOpened(attributes: DisableFocusOnSettingsOpened) {
    useEffect(() => {
        if (attributes.isSettingsOpened) {
            attributes.setIsFocusEnabled(false)
            return
        }

        attributes.setIsFocusEnabled(true)
    }, [attributes.isSettingsOpened])
}

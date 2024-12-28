import { useEffect } from "react"


export interface DisableFocusOnSettingsOpen {
  isSettingsOpen: boolean
  setIsFocusEnabled: (enabled: boolean) => void
}


export function useDisableFocusOnSettingsOpen(attributes: DisableFocusOnSettingsOpen) {
  useEffect(() => {
    if (attributes.isSettingsOpen) {
      attributes.setIsFocusEnabled(false)
    } else {
      attributes.setIsFocusEnabled(true)
    }
  }, [attributes.isSettingsOpen])
}

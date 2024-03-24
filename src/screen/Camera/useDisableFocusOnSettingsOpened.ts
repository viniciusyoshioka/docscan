import { useEffect } from "react"


export interface DisableFocusOnSettingsOpen {
  isSettingsOpen: boolean
  setIsFocusEnabled: (enabled: boolean) => void
}


export function useDisableFocusOnSettingsOpen(attrs: DisableFocusOnSettingsOpen) {
  useEffect(() => {
    if (attrs.isSettingsOpen) {
      attrs.setIsFocusEnabled(false)
    } else {
      attrs.setIsFocusEnabled(true)
    }
  }, [attrs.isSettingsOpen])
}

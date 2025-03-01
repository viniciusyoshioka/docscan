import { useEffect } from "react"


export interface DisableFocusOnSettingsOpenParams {
  isSettingsOpen: boolean
  setIsFocusEnabled: (isEnabled: boolean) => void
}


export function useDisableFocusOnSettingsOpen(params: DisableFocusOnSettingsOpenParams) {
  useEffect(() => {
    const newIsFocusEnabled = !params.isSettingsOpen
    params.setIsFocusEnabled(newIsFocusEnabled)
  }, [params.isSettingsOpen])
}

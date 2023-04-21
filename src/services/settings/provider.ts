import { createContext, useContext } from "react"

import { settingsContextDefaultValue } from "./constants"
import { SettingsContextValue } from "./types"


const SettingsContext = createContext<SettingsContextValue>(settingsContextDefaultValue)


export const SettingsProvider = SettingsContext.Provider


export function useSettings() {
    return useContext(SettingsContext)
}

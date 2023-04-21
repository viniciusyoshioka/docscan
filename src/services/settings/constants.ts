import { Settings, SettingsContextValue } from "./types"


export const settingsDefault: Settings = {
    theme: "auto",
    camera: {
        flash: "off",
        type: "back",
        ratio: "3:4",
    },
}


export const settingsContextDefaultValue: SettingsContextValue = {
    settings: settingsDefault,
    setSettings: () => {},
}

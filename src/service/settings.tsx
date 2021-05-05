
// Settings type
// Camera
export type flashType = "auto" | "on" | "off"

export type whiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

export type SettingsCameraProps = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
}

// Object
export type SettingsProps = {
    camera: SettingsCameraProps
}


// Settings default value
// Camera
export const settingsDefaultCamera: SettingsCameraProps = {
    flash: "off",
    whiteBalance: "auto"
}

// Object
export const settingsDefault: SettingsProps = {
    camera: settingsDefaultCamera
}

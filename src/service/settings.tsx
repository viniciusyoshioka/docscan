
// Settings type
// Camera
export type flashType = "auto" | "on" | "off"

export type whiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

export type cameraType = "front" | "back"

export type cameraId = string

export type SettingsCameraProps = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
    cameraType: cameraType,
    cameraId: cameraId,
}

// Object
export type SettingsProps = {
    camera: SettingsCameraProps,
}


// Settings default value
// Camera
export const settingsDefaultCamera: SettingsCameraProps = {
    flash: "off",
    whiteBalance: "auto",
    cameraType: "back",
    cameraId: "0",
}

// Object
export const settingsDefault: SettingsProps = {
    camera: settingsDefaultCamera,
}

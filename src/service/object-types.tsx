
// Settings
// Settings - Camera
export type flashType = "auto" | "on" | "off"

export type whiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

export type SettingsCameraProps = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
}

// Settings - Theme
export type themeType = "auto" | "light" | "dark"

// Settings - Object
export type SettingsProps = {
    camera: SettingsCameraProps,
    theme: themeType
}


// Document
export type Document = {
    id: number,
    name: string,
    pictureList: Array<string>,
    lastModificationDate: string,
}

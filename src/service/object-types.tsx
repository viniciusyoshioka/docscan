
// Settings object type
export type flashType = "auto" | "on" | "off"

export type whiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

export interface SettingsCameraProps {
    flash: flashType,
    focus: number,
    whiteBalance: whiteBalanceType,
}

export interface SettingsProps {
    camera: SettingsCameraProps,
}


// Document
export interface Document {
    id: number,
    name: string,
    pictureList: Array<string>,
    lastModificationDate: string,
}

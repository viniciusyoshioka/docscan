
// Settings object type
export type flashType = "auto" | "on" | "off"

export type whiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

export type SettingsCameraProps = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
}

export type SettingsProps = {
    camera: SettingsCameraProps,
}


// Document
export type Document = {
    id: number,
    name: string,
    pictureList: Array<string>,
    lastModificationDate: string,
}


// Log
export type logCode = "INFO" | "WARN" | "ERROR"

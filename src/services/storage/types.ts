
export enum AppSettingsKeys {
    THEME = "settings.theme",
    CAMERA_FLASH = "settings.camera.flash",
    CAMERA_TYPE = "settings.camera.type",
    CAMERA_RATIO = "settings.camera.ratio",
}


export type MMKVHook<T> = [
    value: T | undefined,
    setValue: (value: T | ((current: T | undefined) => T | undefined) | undefined) => void
]

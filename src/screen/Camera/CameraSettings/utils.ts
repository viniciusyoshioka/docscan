import { translate } from "@locales"
import { CameraFlash, CameraRatio, CameraType } from "@services/settings"


export function getFlashIcon(cameraFlash: CameraFlash): string {
    if (cameraFlash === "on") return "flash"
    if (cameraFlash === "off") return "flash-off"
    return "flash-auto"
}

export function getSwitchCameraButtonText(cameraType: CameraType): string {
    if (cameraType === "back") return translate("CameraSettings_frontalCamera")
    if (cameraType === "front") return translate("CameraSettings_backCamera")
    return translate("CameraSettings_flip")
}

export function getChangeRatioButtonText(cameraRatio: CameraRatio): string {
    if (cameraRatio === "4:3") return `${translate("CameraSettings_ratio")} 4:3`
    if (cameraRatio === "16:9") return `${translate("CameraSettings_ratio")} 16:9`
    return translate("CameraSettings_ratio")
}


type NextFlashSetting = {
    [key in CameraFlash]: CameraFlash
}

export const nextFlashSetting: NextFlashSetting = {
    "auto": "on",
    "on": "off",
    "off": "auto",
}


type NextCameraTypeSetting = {
    [key in CameraType]: CameraType
}

export const nextCameraTypeSetting: NextCameraTypeSetting = {
    "back": "front",
    "front": "back",
}


type NextRatioSetting = {
    [key in CameraRatio]: CameraRatio
}

export const nextRatioSetting: NextRatioSetting = {
    "4:3": "16:9",
    "16:9": "4:3",
}

import { CameraFlash, CameraPosition, CameraRatio } from "@lib/settings/camera"
import { translate } from "@locales"


export function getFlashIcon(cameraFlash: CameraFlash): string {
  if (cameraFlash === "on") return "flash"
  if (cameraFlash === "off") return "flash-off"
  return "flash-auto"
}

export function getSwitchCameraButtonText(cameraPosition: CameraPosition): string {
  if (cameraPosition === "back") return translate("CameraSettings_frontalCamera")
  if (cameraPosition === "front") return translate("CameraSettings_backCamera")
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
  auto: "on",
  on: "off",
  off: "auto",
}


type NextCameraPositionSetting = {
  [key in CameraPosition]: CameraPosition
}

export const nextCameraPositionSetting: NextCameraPositionSetting = {
  back: "front",
  front: "back",
}


type NextRatioSetting = {
  [key in CameraRatio]: CameraRatio
}

export const nextRatioSetting: NextRatioSetting = {
  "4:3": "16:9",
  "16:9": "4:3",
}

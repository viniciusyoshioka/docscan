import { IconNames } from "react-native-paper-towel"

import { CameraFlash, CameraPosition, CameraRatio } from "@libs/settings"
import { translate } from "@locales"


type FlashSettingIcon = {
  [key in CameraFlash]: IconNames
}

export const flashSettingIcon: FlashSettingIcon = {
  auto: "flash-auto",
  on: "flash",
  off: "flash-off",
}


type CameraPositionSettingText = {
  [key in CameraPosition]: string
}

export const cameraPositionSettingText: CameraPositionSettingText = {
  back: translate("CameraSettings_frontalCamera"),
  front: translate("CameraSettings_backCamera"),
}


type RatioSettingText = {
  [key in CameraRatio]: string
}

export const ratioSettingText: RatioSettingText = {
  "4:3": `${translate("CameraSettings_ratio")} 4:3`,
  "16:9": `${translate("CameraSettings_ratio")} 16:9`,
}

import { CameraFlash, CameraPosition, CameraRatio } from "@libs/settings"


type NextFlashSetting = {
  [key in CameraFlash]: CameraFlash
}

export const nextFlashSetting: NextFlashSetting = {
  [CameraFlash.AUTO]: CameraFlash.ON,
  [CameraFlash.ON]: CameraFlash.OFF,
  [CameraFlash.OFF]: CameraFlash.AUTO,
}


type NextCameraPositionSetting = {
  [key in CameraPosition]: CameraPosition
}

export const nextCameraPositionSetting: NextCameraPositionSetting = {
  [CameraPosition.BACK]: CameraPosition.FRONT,
  [CameraPosition.FRONT]: CameraPosition.BACK,
}


type NextRatioSetting = {
  [key in CameraRatio]: CameraRatio
}

export const nextRatioSetting: NextRatioSetting = {
  [CameraRatio.RATIO_4_3]: CameraRatio.RATIO_16_9,
  [CameraRatio.RATIO_16_9]: CameraRatio.RATIO_4_3,
}

import type { CameraRatio } from '@modules/settings'


export const CAMERA_RATIO_TO_RATIO_NUMBER: Record<CameraRatio, number> = {
  '4:3': 4 / 3,
  '16:9': 16 / 9,
}


export const RATIO_NUMBER_TO_CAMERA_RATIO: Record<
  number,
  CameraRatio | undefined
> = Object.fromEntries(
  Object
    .entries(CAMERA_RATIO_TO_RATIO_NUMBER)
    .map(([key, value]) => [value, key] as [number, CameraRatio]),
)

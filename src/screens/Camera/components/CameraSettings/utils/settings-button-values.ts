import type { IconNames } from 'react-native-paper-towel'

import { locale, Namespaces } from '@locale'
import type {
  CameraFlash,
  CameraPosition,
  CameraRatio,
} from '@modules/settings'


type FlashSettingIcon = {
  [key in CameraFlash]: IconNames
}

export const flashSettingIcon: FlashSettingIcon = {
  auto: 'flash-auto',
  on: 'flash',
  off: 'flash-off',
}


type CameraPositionSettingText = {
  [key in CameraPosition]: string
}

export const cameraPositionSettingText: CameraPositionSettingText = {
  back: locale.t('CameraSettings_frontalCamera', { ns: Namespaces.APP }),
  front: locale.t('CameraSettings_backCamera', { ns: Namespaces.APP }),
}


type RatioSettingText = {
  [key in CameraRatio]: string
}

export const ratioSettingText: RatioSettingText = {
  '4:3': `${locale.t('CameraSettings_ratio', { ns: Namespaces.APP })} 4:3`,
  '16:9': `${locale.t('CameraSettings_ratio', { ns: Namespaces.APP })} 16:9`,
}

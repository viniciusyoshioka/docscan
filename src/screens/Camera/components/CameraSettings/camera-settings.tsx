import { Namespaces, useLocale } from '@locale'
import { useSettings } from '@modules/settings'
import type { CameraState } from '../../hooks'
import type { SettingsModalProps } from './components'
import { SettingsButton, SettingsModal } from './components'
import {
  useCameraCanFlip,
  useChangeCameraSettings,
  useIsFlashSupported,
  useIsRatioSupported,
} from './hooks'
import {
  cameraPositionSettingText,
  flashSettingIcon,
  ratioSettingText,
} from './utils'


interface CameraSettingsProps extends SettingsModalProps {
  isShowingCamera: boolean
  cameraState: CameraState
}


export function CameraSettings(props: CameraSettingsProps) {
  const { cameraState } = props


  const { settings } = useSettings()
  const { t } = useLocale()

  const isFlashSupported = useIsFlashSupported({ cameraState })
  const cameraCanFlip = useCameraCanFlip({ cameraState })
  const isRatioSupported = useIsRatioSupported({ cameraState })

  const changeCameraSettings = useChangeCameraSettings()


  const flashIcon = flashSettingIcon[
    settings.camera.flash
  ]
  const switchCameraButtonText = cameraPositionSettingText[
    settings.camera.position
  ]
  const changeRatioButtonText = ratioSettingText[
    settings.camera.ratio
  ]


  return (
    <SettingsModal {...props}>
      <SettingsButton
        icon={flashIcon}
        optionName={t('CameraSettings_flash', { ns: Namespaces.APP })}
        onPress={changeCameraSettings.changeFlash}
        isDisabled={!isFlashSupported}
      />

      <SettingsButton
        icon={'orbit-variant'}
        optionName={switchCameraButtonText}
        onPress={changeCameraSettings.switchCameraPosition}
        isVisible={cameraCanFlip}
      />

      <SettingsButton
        icon={'aspect-ratio'}
        optionName={changeRatioButtonText}
        onPress={changeCameraSettings.changeCameraRatio}
        isDisabled={!isRatioSupported}
      />

      <SettingsButton
        icon={'restore'}
        optionName={t('CameraSettings_reset', { ns: Namespaces.APP })}
        onPress={changeCameraSettings.resetCameraSettings}
      />
    </SettingsModal>
  )
}

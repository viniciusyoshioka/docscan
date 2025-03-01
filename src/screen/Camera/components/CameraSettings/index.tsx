import { useSettings } from "@libs/settings"
import { translate } from "@locales"
import { SettingsButton, SettingsModal, SettingsModalProps } from "./components"
import {
  useChangeCameraSettings,
  useIsCameraFlippable,
  useIsFlashSupported,
  useIsRatioSupported,
} from "./hooks"
import { cameraPositionSettingText, flashSettingIcon, ratioSettingText } from "./utils"


interface CameraSettingsProps extends SettingsModalProps {
  isShowingCamera: boolean
}


// TODO: Maybe pass the cameraDevice and cameraFormat in use to check if they support the feature
export function CameraSettings(props: CameraSettingsProps) {


  const { settings } = useSettings()

  const changeCameraSettings = useChangeCameraSettings()
  const isFlashSupported = useIsFlashSupported()
  const isCameraFlippable = useIsCameraFlippable()
  const isRatioSupported = useIsRatioSupported()


  const flashIcon = flashSettingIcon[settings.camera.flash]
  const switchCameraButtonText = cameraPositionSettingText[settings.camera.position]
  const changeRatioButtonText = ratioSettingText[settings.camera.ratio]


  return (
    <SettingsModal {...props}>
      <SettingsButton
        icon={flashIcon}
        optionName={translate("CameraSettings_flash")}
        onPress={changeCameraSettings.changeFlash}
        isDisabled={!isFlashSupported}
      />

      <SettingsButton
        icon={"orbit-variant"}
        optionName={switchCameraButtonText}
        onPress={changeCameraSettings.switchCameraPosition}
        isVisible={isCameraFlippable}
      />

      <SettingsButton
        icon={"aspect-ratio"}
        optionName={changeRatioButtonText}
        onPress={changeCameraSettings.changeCameraRatio}
        isDisabled={!isRatioSupported}
      />

      <SettingsButton
        icon={"restore"}
        optionName={translate("CameraSettings_reset")}
        onPress={changeCameraSettings.resetCameraSettings}
      />
    </SettingsModal>
  )
}

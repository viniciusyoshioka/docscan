import { defaultSettings, useSettings } from "@lib/settings"
import { translate } from "@locales"
import { useCameraControlDimensions } from "../CameraControl"
import { useIsCameraFlippable } from "../useIsCameraFlippable"
import { SettingsButton } from "./SettingsButton"
import { SettingsModal, SettingsModalProps } from "./SettingsModal"
import {
  getChangeRatioButtonText,
  getFlashIcon,
  getSwitchCameraButtonText,
  nextCameraPositionSetting,
  nextFlashSetting,
  nextRatioSetting,
} from "./utils"


export interface CameraSettingsProps extends SettingsModalProps {}


export function CameraSettings(props: CameraSettingsProps) {


  const { settings, setSettings } = useSettings()

  const isCameraFlippable = useIsCameraFlippable()

  const cameraControlDimensions = useCameraControlDimensions()
  const { size, shouldUseWithoutCameraStyle } = cameraControlDimensions
  const cameraControlheight = shouldUseWithoutCameraStyle
    ? size.HEIGHT_WITHOUT_CAMERA
    : size.HEIGHT_WITH_CAMERA


  const flashIcon = getFlashIcon(settings.camera.flash)
  const switchCameraButtonText = getSwitchCameraButtonText(settings.camera.position)
  const changeRatioButtonText = getChangeRatioButtonText(settings.camera.ratio)


  async function changeFlash() {
    setSettings({
      camera: {
        flash: nextFlashSetting[settings.camera.flash],
      },
    })
  }

  async function switchCameraPosition() {
    setSettings({
      camera: {
        position: nextCameraPositionSetting[settings.camera.position],
      },
    })
  }

  async function changeCameraRatio() {
    setSettings({
      camera: {
        ratio: nextRatioSetting[settings.camera.ratio],
      },
    })
  }

  async function resetCameraSettings() {
    setSettings({
      camera: defaultSettings.camera,
    })
  }


  return (
    <SettingsModal {...props} containerStyle={{ marginBottom: cameraControlheight }}>
      <SettingsButton
        icon={flashIcon}
        optionName={translate("CameraSettings_flash")}
        onPress={changeFlash}
      />

      {isCameraFlippable && (
        <SettingsButton
          icon={"orbit-variant"}
          optionName={switchCameraButtonText}
          onPress={switchCameraPosition}
        />
      )}

      <SettingsButton
        icon={"aspect-ratio"}
        optionName={changeRatioButtonText}
        onPress={changeCameraRatio}
      />

      <SettingsButton
        icon={"restore"}
        optionName={translate("CameraSettings_reset")}
        onPress={resetCameraSettings}
      />
    </SettingsModal>
  )
}

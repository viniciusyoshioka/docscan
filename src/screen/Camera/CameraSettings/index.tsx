import { translate } from "@locales"
import { settingsCameraFlashDefault, settingsCameraRatioDefault, settingsCameraTypeDefault, useSettings } from "@services/settings"
import { useCameraControlDimensions } from "../CameraControl"
import { useIsCameraFlippable } from "../useIsCameraFlippable"
import { SettingsButton } from "./SettingsButton"
import { SettingsModal, SettingsModalProps } from "./SettingsModal"
import { getChangeRatioButtonText, getFlashIcon, getSwitchCameraButtonText, nextCameraTypeSetting, nextFlashSetting, nextRatioSetting } from "./utils"


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
    const switchCameraButtonText = getSwitchCameraButtonText(settings.camera.type)
    const changeRatioButtonText = getChangeRatioButtonText(settings.camera.ratio)


    async function changeFlash() {
        const newSettings = { ...settings }
        newSettings.camera.flash = nextFlashSetting[settings.camera.flash]
        setSettings(newSettings)
    }

    async function switchCameraType() {
        const newSettings = { ...settings }
        newSettings.camera.type = nextCameraTypeSetting[settings.camera.type]
        setSettings(newSettings)
    }

    async function changeCameraRatio() {
        const newSettings = { ...settings }
        newSettings.camera.ratio = nextRatioSetting[settings.camera.ratio]
        setSettings(newSettings)
    }

    async function resetCameraSettings() {
        const newSettings = { ...settings }
        newSettings.camera.flash = settingsCameraFlashDefault
        newSettings.camera.type = settingsCameraTypeDefault
        newSettings.camera.ratio = settingsCameraRatioDefault
        setSettings(newSettings)
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
                    onPress={switchCameraType}
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

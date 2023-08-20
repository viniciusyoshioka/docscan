import { useEffect } from "react"
import { OrientationType } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useCameraDevices, useDeviceOrientation } from "@hooks"
import { translate } from "@locales"
import { settingsCameraFlashDefault, settingsCameraRatioDefault, settingsCameraTypeDefault, useSettings } from "@services/settings"
import { useCameraControlDimensions } from "../CameraControl"
import { useIsCameraFlippable } from "../useIsCameraFlippable"
import { CameraSettingsButton } from "./CameraSettingsButton"
import { CameraSettingsModal, CameraSettingsModalProps } from "./CameraSettingsModal"
import { getChangeRatioButtonText, getFlashIcon, getSwitchCameraButtonText, nextCameraTypeSetting, nextFlashSetting, nextRatioSetting } from "./utils"


export interface CameraSettingsProps extends CameraSettingsModalProps {}


export function CameraSettings(props: CameraSettingsProps) {


    const deviceOrientation = useDeviceOrientation()

    const cameraDevices = useCameraDevices()
    const isCameraFlippable = useIsCameraFlippable({ cameraDevices })

    const { settings, setSettings } = useSettings()

    const cameraControlDimensions = useCameraControlDimensions()
    const { size, shouldUseWithoutCameraStyle } = cameraControlDimensions
    const cameraControlheight = shouldUseWithoutCameraStyle
        ? size.HEIGHT_WITHOUT_CAMERA
        : size.HEIGHT_WITH_CAMERA

    const rotationDegree = useSharedValue(0)


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


    useEffect(() => {
        switch (deviceOrientation) {
            case OrientationType["PORTRAIT"]:
                if (rotationDegree.value === 90) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 0
                }
                break
            case OrientationType["PORTRAIT-UPSIDEDOWN"]:
                if (rotationDegree.value === 90) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 180
                }
                break
            case OrientationType["LANDSCAPE-LEFT"]:
                if (rotationDegree.value === 0) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 90
                }
                break
            case OrientationType["LANDSCAPE-RIGHT"]:
                if (rotationDegree.value === 0) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 270
                }
                break
        }
    }, [deviceOrientation])

    const animatedRotation = useDerivedValue(() => withTiming(rotationDegree.value, {
        duration: 200,
    }))

    const orientationStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${animatedRotation.value}deg` },
        ],
    }))


    return (
        <CameraSettingsModal {...props} containerStyle={{ marginBottom: cameraControlheight }}>
            <Reanimated.View style={orientationStyle}>
                <CameraSettingsButton
                    optionName={translate("CameraSettings_flash")}
                    iconName={flashIcon}
                    onPress={changeFlash}
                />
            </Reanimated.View>

            {isCameraFlippable && (
                <Reanimated.View style={orientationStyle}>
                    <CameraSettingsButton
                        optionName={switchCameraButtonText}
                        iconName={"flip-camera-android"}
                        onPress={switchCameraType}
                    />
                </Reanimated.View>
            )}

            <Reanimated.View style={orientationStyle}>
                <CameraSettingsButton
                    optionName={changeRatioButtonText}
                    iconName={"aspect-ratio"}
                    onPress={changeCameraRatio}
                />
            </Reanimated.View>

            <Reanimated.View style={orientationStyle}>
                <CameraSettingsButton
                    optionName={translate("CameraSettings_reset")}
                    iconName={"restore"}
                    onPress={resetCameraSettings}
                />
            </Reanimated.View>
        </CameraSettingsModal>
    )
}

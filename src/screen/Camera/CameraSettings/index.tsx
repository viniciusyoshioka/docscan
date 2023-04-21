import { useEffect, useMemo } from "react"
import { OrientationType } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDeviceOrientation } from "../../../hooks"
import { translate } from "../../../locales"
import { settingsCameraFlashDefault, settingsCameraRatioDefault, settingsCameraTypeDefault, useSettings } from "../../../services/settings"
import { CameraSettingsButton } from "./CameraSettingsButton"
import { CameraSettingsModal, CameraSettingsModalProps } from "./CameraSettingsModal"


export interface CameraSettingsProps extends CameraSettingsModalProps {
    isFlippable: boolean;
}


export function CameraSettings(props: CameraSettingsProps) {


    const deviceOrientation = useDeviceOrientation()

    const { settings, setSettings } = useSettings()

    const rotationDegree = useSharedValue(0)


    const flashIcon = useMemo((): string => {
        switch (settings.camera.flash) {
            case "auto":
                return "flash-auto"
            case "on":
                return "flash-on"
            case "off":
                return "flash-off"
            default:
                return "flash-auto"
        }
    }, [settings.camera.flash])

    const switchCameraButtonText = useMemo((): string => {
        switch (settings.camera.type) {
            case "back":
                return translate("CameraSettings_frontalCamera")
            case "front":
                return translate("CameraSettings_backCamera")
            default:
                return translate("CameraSettings_flip")
        }
    }, [settings.camera.type])

    const changeRatioButtonText = useMemo((): string => {
        switch (settings.camera.ratio) {
            case "3:4":
                return `${translate("CameraSettings_ratio")} 3:4`
            case "9:16":
                return `${translate("CameraSettings_ratio")} 9:16`
            default:
                return translate("CameraSettings_ratio")
        }
    }, [settings.camera.ratio])


    async function changeFlash() {
        const newSettings = { ...settings }
        switch (settings.camera.flash) {
            case "auto":
                newSettings.camera.flash = "on"
                break
            case "on":
                newSettings.camera.flash = "off"
                break
            case "off":
                newSettings.camera.flash = "auto"
                break
        }
        setSettings(newSettings)
    }

    async function switchCameraType() {
        const newSettings = { ...settings }
        switch (settings.camera.type) {
            case "back":
                newSettings.camera.type = "front"
                break
            case "front":
                newSettings.camera.type = "back"
                break
        }
        setSettings(newSettings)
    }

    async function changeCameraRatio() {
        const newSettings = { ...settings }
        switch (settings.camera.ratio) {
            case "3:4":
                newSettings.camera.ratio = "9:16"
                break
            case "9:16":
                newSettings.camera.ratio = "3:4"
                break
        }
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
        <CameraSettingsModal {...props}>
            <Reanimated.View style={orientationStyle}>
                <CameraSettingsButton
                    optionName={translate("CameraSettings_flash")}
                    iconName={flashIcon}
                    onPress={changeFlash}
                />
            </Reanimated.View>

            {props.isFlippable && (
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

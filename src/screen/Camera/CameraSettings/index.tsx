import { useEffect, useMemo } from "react"
import { useMMKVString } from "react-native-mmkv"
import { OrientationType } from "react-native-orientation-locker"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDeviceOrientation } from "../../../hooks"
import { translate } from "../../../locales"
import { CameraRatio, CameraType, FlashType, settingsCameraFlashDefault, settingsCameraRatioDefault, settingsCameraTypeDefault } from "../../../services/settings"
import { AppStorageKeys, MMKVHook } from "../../../services/storage"
import { CameraSettingsButton } from "./CameraSettingsButton"
import { CameraSettingsModal, CameraSettingsModalProps } from "./CameraSettingsModal"


export interface CameraSettingsProps extends CameraSettingsModalProps {
    isFlippable: boolean;
}


export function CameraSettings(props: CameraSettingsProps) {


    const deviceOrientation = useDeviceOrientation()

    const [cameraFlash, setCameraFlash] = useMMKVString(AppStorageKeys.CAMERA_FLASH) as MMKVHook<FlashType>
    const [cameraType, setCameraType] = useMMKVString(AppStorageKeys.CAMERA_TYPE) as MMKVHook<CameraType>
    const [cameraRatio, setCameraRatio] = useMMKVString(AppStorageKeys.CAMERA_RATIO) as MMKVHook<CameraRatio>

    const rotationDegree = useSharedValue(0)


    const flashIcon = useMemo((): string => {
        switch (cameraFlash) {
            case "auto":
                return "flash-auto"
            case "on":
                return "flash-on"
            case "off":
                return "flash-off"
            default:
                return "flash-auto"
        }
    }, [cameraFlash])

    const switchCameraButtonText = useMemo((): string => {
        switch (cameraType) {
            case "back":
                return translate("CameraSettings_frontalCamera")
            case "front":
                return translate("CameraSettings_backCamera")
            default:
                return translate("CameraSettings_flip")
        }
    }, [cameraType])

    const changeRatioButtonText = useMemo((): string => {
        switch (cameraRatio) {
            case "3:4":
                return `${translate("CameraSettings_ratio")} 3:4`
            case "9:16":
                return `${translate("CameraSettings_ratio")} 9:16`
            default:
                return translate("CameraSettings_ratio")
        }
    }, [cameraRatio])


    async function changeFlash() {
        switch (cameraFlash) {
            case "auto":
                setCameraFlash("on")
                break
            case "on":
                setCameraFlash("off")
                break
            case "off":
                setCameraFlash("auto")
                break
        }
    }

    async function switchCameraType() {
        switch (cameraType) {
            case "back":
                setCameraType("front")
                break
            case "front":
                setCameraType("back")
                break
        }
    }

    async function changeCameraRatio() {
        switch (cameraRatio) {
            case "3:4":
                setCameraRatio("9:16")
                break
            case "9:16":
                setCameraRatio("3:4")
                break
        }
    }

    async function resetCameraSettings() {
        setCameraFlash(settingsCameraFlashDefault)
        setCameraType(settingsCameraTypeDefault)
        setCameraRatio(settingsCameraRatioDefault)
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

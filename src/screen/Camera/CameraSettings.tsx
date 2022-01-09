import React from "react"
import { ScrollView } from "react-native"
import { HardwareCamera } from "react-native-camera"

import { CameraSettingsButton, ModalCameraSettings, ModalCameraSettingsProps } from "../../components"
import { SettingsDatabase } from "../../database"
import { useCameraSettings } from "../../services/camera"
import { cameraFlashDefault, cameraIdDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "../../services/settings"
import { CameraType, FlashType, WhiteBalanceType } from "../../types"


export interface CameraSettingsProps extends ModalCameraSettingsProps {
    isMultipleCameraAvailable: boolean,
    currentCameraIndex: number,
    setCurrentCameraIndex: (newCurrentCameraIndex: number) => void
    cameraList: Array<HardwareCamera>,
}


export function CameraSettings(props: CameraSettingsProps) {


    const { cameraSettingsState, dispatchCameraSettings } = useCameraSettings()


    async function changeFlash() {
        let newFlash: FlashType = "auto"
        switch (cameraSettingsState.flash) {
            case "auto":
                newFlash = "on"
                break
            case "on":
                newFlash = "off"
                break
            case "off":
                newFlash = "auto"
                break
        }

        dispatchCameraSettings({ type: "flash", payload: newFlash })
        await SettingsDatabase.updateSettings("cameraFlash", newFlash)
    }

    async function changeWhiteBalance() {
        let newWhiteBalance: WhiteBalanceType = "auto"
        switch (cameraSettingsState.whiteBalance) {
            case "auto":
                newWhiteBalance = "sunny"
                break
            case "sunny":
                newWhiteBalance = "cloudy"
                break
            case "cloudy":
                newWhiteBalance = "fluorescent"
                break
            case "fluorescent":
                newWhiteBalance = "incandescent"
                break
            case "incandescent":
                newWhiteBalance = "auto"
                break
        }

        dispatchCameraSettings({ type: "white-balance", payload: newWhiteBalance })
        await SettingsDatabase.updateSettings("cameraWhiteBalance", newWhiteBalance)
    }

    async function switchCameraType() {
        let newCameraType: CameraType = "back"
        switch (cameraSettingsState.cameraType) {
            case "back":
                newCameraType = "front"
                break
            case "front":
                newCameraType = "back"
                break
        }

        dispatchCameraSettings({ type: "camera-type", payload: newCameraType })
        await SettingsDatabase.updateSettings("cameraType", newCameraType)
    }

    async function switchCameraId() {
        let newIndex = 0
        if ((props.currentCameraIndex + 1) < props.cameraList.length) {
            newIndex = props.currentCameraIndex + 1
        }

        dispatchCameraSettings({ type: "camera-id", payload: props.cameraList[newIndex].id })
        props.setCurrentCameraIndex(newIndex)
        await SettingsDatabase.updateSettings("cameraId", props.cameraList[newIndex].id)
    }

    async function resetCameraSettings() {
        dispatchCameraSettings({ type: "reset" })

        await SettingsDatabase.updateSettings("cameraFlash", cameraFlashDefault)
        await SettingsDatabase.updateSettings("cameraWhiteBalance", cameraWhiteBalanceDefault)
        await SettingsDatabase.updateSettings("cameraType", cameraTypeDefault)
        await SettingsDatabase.updateSettings("cameraId", cameraIdDefault)
    }


    return (
        <ModalCameraSettings {...props}>
            <ScrollView horizontal={true}>
                <CameraSettingsButton
                    icon={
                        cameraSettingsState.flash === "auto"
                            ? "flash-auto"
                            : cameraSettingsState.flash === "on"
                                ? "flash-on"
                                : "flash-off"
                    }
                    onPress={changeFlash}
                />

                <CameraSettingsButton
                    icon={
                        cameraSettingsState.whiteBalance === "auto"
                            ? "wb-auto"
                            : cameraSettingsState.whiteBalance === "sunny"
                                ? "wb-sunny"
                                : cameraSettingsState.whiteBalance === "cloudy"
                                    ? "wb-cloudy"
                                    : cameraSettingsState.whiteBalance === "fluorescent"
                                        ? "wb-iridescent"
                                        : "wb-incandescent"
                    }
                    onPress={changeWhiteBalance}
                />

                <CameraSettingsButton
                    icon={"flip-camera-android"}
                    onPress={switchCameraType}
                />

                {props.isMultipleCameraAvailable && (
                    <CameraSettingsButton
                        icon={"switch-camera"}
                        onPress={switchCameraId}
                    />
                )}

                <CameraSettingsButton
                    icon={"restore"}
                    onPress={resetCameraSettings}
                />
            </ScrollView>
        </ModalCameraSettings>
    )
}

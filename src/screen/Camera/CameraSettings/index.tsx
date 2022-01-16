import React from "react"
import { Alert, ScrollView } from "react-native"

import { CameraSettingsButton } from "../../../components"
import { SettingsDatabase } from "../../../database"
import { useCameraSettings } from "../../../services/camera"
import { log } from "../../../services/log"
import { cameraFlashDefault, cameraIdDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "../../../services/settings"
import { CameraType, FlashType, WhiteBalanceType } from "../../../types"
import { CameraSettingsModal, CameraSettingsModalProps } from "./CameraSettingsModal"


export interface CameraSettingsProps extends CameraSettingsModalProps {
    isFlippable: boolean;
    // isMultipleCameraAvailable: boolean;
    // currentCameraIndex: number;
    // setCurrentCameraIndex: (newCurrentCameraIndex: number) => void;
    // cameraList: Array<HardwareCamera>;
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
        try {
            await SettingsDatabase.updateSettings("cameraFlash", newFlash)
        } catch (error) {
            log.error(`Error saving new camera flash setting in database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro salvando nova configuração de flash"
            )
        }
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
        try {
            await SettingsDatabase.updateSettings("cameraWhiteBalance", newWhiteBalance)
        } catch (error) {
            log.error(`Error saving new camera white balance setting in database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro salvando nova configuração de balanço de branco"
            )
        }
    }

    async function switchCameraType() {
        if (!props.isFlippable) {
            log.warn("Current camera device is not flippable")
            return
        }

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
        try {
            await SettingsDatabase.updateSettings("cameraType", newCameraType)
        } catch (error) {
            log.error(`Error saving new camera type setting in database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro salvando nova configuração de tipo da câmera"
            )
        }
    }

    async function switchCameraId() {
        // let newIndex = 0
        // if ((props.currentCameraIndex + 1) < props.cameraList.length) {
        //     newIndex = props.currentCameraIndex + 1
        // }
        // 
        // dispatchCameraSettings({ type: "camera-id", payload: props.cameraList[newIndex].id })
        // props.setCurrentCameraIndex(newIndex)
        // try {
        //     await SettingsDatabase.updateSettings("cameraId", props.cameraList[newIndex].id)
        // } catch (error) {
        //     log.error(`Error saving new camera id setting in database: "${error}"`)
        //     Alert.alert(
        //         "Aviso",
        //         "Erro salvando nova configuração de id da câmera"
        //     )
        // }
    }

    async function resetCameraSettings() {
        dispatchCameraSettings({ type: "reset" })

        try {
            await SettingsDatabase.updateSettings("cameraFlash", cameraFlashDefault)
        } catch (error) {
            log.error(`Error reseting camera flash setting in database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro redefinindo configuração de flash"
            )
        }

        try {
            await SettingsDatabase.updateSettings("cameraWhiteBalance", cameraWhiteBalanceDefault)
        } catch (error) {
            log.error(`Error reseting camera white balance setting in database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro redefinindo configuração de balanço de branco"
            )
        }

        try {
            await SettingsDatabase.updateSettings("cameraType", cameraTypeDefault)
        } catch (error) {
            log.error(`Error reseting camera type setting in database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro redefinindo configuração de tipo de câmera"
            )
        }

        try {
            await SettingsDatabase.updateSettings("cameraId", cameraIdDefault)
        } catch (error) {
            log.error(`Error reseting camera id setting in database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro redefinindo configuração de id da câmera"
            )
        }
    }


    return (
        <CameraSettingsModal {...props}>
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

                {/* <CameraSettingsButton
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
                /> */}

                {props.isFlippable && (
                    <CameraSettingsButton
                        icon={"flip-camera-android"}
                        onPress={switchCameraType}
                    />
                )}

                {/* {props.isMultipleCameraAvailable && (
                    <CameraSettingsButton
                        icon={"switch-camera"}
                        onPress={switchCameraId}
                    />
                )} */}

                <CameraSettingsButton
                    icon={"restore"}
                    onPress={resetCameraSettings}
                />
            </ScrollView>
        </CameraSettingsModal>
    )
}

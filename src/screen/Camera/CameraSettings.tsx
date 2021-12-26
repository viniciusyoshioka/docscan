import React, { Dispatch, useCallback } from "react"
import { ScrollView } from "react-native"
import { HardwareCamera } from "react-native-camera"

import { CameraSettingsButton, ModalCameraSettings, ModalCameraSettingsProps } from "../../component"
import { SettingsDatabase } from "../../database"
import { cameraFlashDefault, cameraIdDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "../../service/settings"
import { CameraAttributes, cameraReducerAction, cameraType, flashType, whiteBalanceType } from "../../types"


export interface CameraSettingsProps extends ModalCameraSettingsProps {
    cameraAttributes: CameraAttributes,
    setCameraAttributes: Dispatch<cameraReducerAction>,
    isMultipleCameraAvailable: boolean,
    currentCameraIndex: number,
    setCurrentCameraIndex: (newCurrentCameraIndex: number) => void
    cameraList: Array<HardwareCamera>,
}


export function CameraSettings(props: CameraSettingsProps) {


    const changeFlash = useCallback(async () => {
        // Change attribute
        let newFlash: flashType = "auto"
        switch (props.cameraAttributes.flash) {
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
        // Set camera attribute
        props.setCameraAttributes({ type: "flash", payload: newFlash })
        // Write settings
        await SettingsDatabase.updateSettings("cameraFlash", newFlash)
    }, [props.cameraAttributes.flash])

    const changeWhiteBalance = useCallback(async () => {
        // Change attribute
        let newWhiteBalance: whiteBalanceType = "auto"
        switch (props.cameraAttributes.whiteBalance) {
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
        // Set camera attribute
        props.setCameraAttributes({ type: "white-balance", payload: newWhiteBalance })
        // Write settings
        await SettingsDatabase.updateSettings("cameraWhiteBalance", newWhiteBalance)
    }, [props.cameraAttributes.whiteBalance])

    const switchCameraType = useCallback(async () => {
        // Change attribute
        let newCameraType: cameraType = "back"
        switch (props.cameraAttributes.cameraType) {
            case "back":
                newCameraType = "front"
                break
            case "front":
                newCameraType = "back"
                break
        }
        // Set camera attribute
        props.setCameraAttributes({ type: "camera-type", payload: newCameraType })
        // Write settings
        await SettingsDatabase.updateSettings("cameraType", newCameraType)
    }, [props.cameraAttributes.cameraType])

    const switchCameraId = useCallback(async () => {
        // Change attribute
        let newIndex = 0
        if ((props.currentCameraIndex + 1) < props.cameraList.length) {
            newIndex = props.currentCameraIndex + 1
        }
        // Set camera attribute
        props.setCameraAttributes({ type: "camera-id", payload: props.cameraList[newIndex].id })
        props.setCurrentCameraIndex(newIndex)
        // Write settings
        await SettingsDatabase.updateSettings("cameraId", props.cameraList[newIndex].id)
    }, [props.cameraAttributes.cameraId])

    const resetCameraSettings = useCallback(async () => {
        props.setCameraAttributes({ type: "reset" })

        await SettingsDatabase.updateSettings("cameraFlash", cameraFlashDefault)
        await SettingsDatabase.updateSettings("cameraWhiteBalance", cameraWhiteBalanceDefault)
        await SettingsDatabase.updateSettings("cameraType", cameraTypeDefault)
        await SettingsDatabase.updateSettings("cameraId", cameraIdDefault)
    }, [])


    return (
        <ModalCameraSettings {...props}>
            <ScrollView horizontal={true}>
                <CameraSettingsButton
                    icon={
                        props.cameraAttributes.flash === "auto"
                            ? "flash-auto"
                            : props.cameraAttributes.flash === "on"
                                ? "flash-on"
                                : "flash-off"
                    }
                    onPress={changeFlash}
                />

                <CameraSettingsButton
                    icon={
                        props.cameraAttributes.whiteBalance === "auto"
                            ? "wb-auto"
                            : props.cameraAttributes.whiteBalance === "sunny"
                                ? "wb-sunny"
                                : props.cameraAttributes.whiteBalance === "cloudy"
                                    ? "wb-cloudy"
                                    : props.cameraAttributes.whiteBalance === "fluorescent"
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

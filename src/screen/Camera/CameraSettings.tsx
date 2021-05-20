import React, { Dispatch, useCallback } from "react"
import { ScrollView } from "react-native"

import { ButtonSettings, ButtonSettingsBase, cameraSettingsIconSize } from "../../component/CameraSettings"
import { Modal, ModalProps } from "../../component/Modal"
import { readSettings, writeSettings } from "../../service/storage"
import { cameraReducerAction } from "../../service/reducer"
import { flashType, SettingsCameraProps, settingsDefaultCamera, whiteBalanceType } from "../../service/settings"

import FlashAuto from "../../image/icon/flash-auto.svg"
import FlashOn from "../../image/icon/flash-on.svg"
import FlashOff from "../../image/icon/flash-off.svg"
import WBAuto from "../../image/icon/wb-auto.svg"
import WBCloud from "../../image/icon/wb-cloud.svg"
import WBFluorescent from "../../image/icon/wb-fluorescent.svg"
import WBIncandescent from "../../image/icon/wb-incandescent.svg"
import WBSun from "../../image/icon/wb-sun.svg"


export interface CameraSettingsProps extends ModalProps {
    cameraAttributes: SettingsCameraProps,
    setCameraAttributes: Dispatch<cameraReducerAction>,
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
        const currentSettings = await readSettings()
        currentSettings.camera.flash = newFlash
        await writeSettings(currentSettings)
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
        const currentSettings = await readSettings()
        currentSettings.camera.whiteBalance = newWhiteBalance
        await writeSettings(currentSettings)
    }, [props.cameraAttributes.whiteBalance])

    const resetCameraSettings = useCallback(async () => {
        props.setCameraAttributes({ type: "reset" })

        const currentSettings = await readSettings()
        currentSettings.camera = settingsDefaultCamera
        await writeSettings(currentSettings)
    }, [])


    return (
        <Modal
            {...props}
            modalStyle={{ marginHorizontal: 6, justifyContent: "flex-end", bottom: 62 }}
            backgroundStyle={{ paddingTop: 4, paddingLeft: 4 }}
        >
            <ScrollView horizontal={true}>
                <ButtonSettingsBase onPress={changeFlash} activeOpacity={0.5}>
                    {(props.cameraAttributes.flash === "auto")
                        ? <FlashAuto
                            width={cameraSettingsIconSize - 3}
                            height={cameraSettingsIconSize - 3}
                            fill={"rgb(255, 255, 255)"} />
                        : (props.cameraAttributes.flash === "on")
                            ? <FlashOn
                                width={cameraSettingsIconSize - 5}
                                height={cameraSettingsIconSize - 5}
                                fill={"rgb(255, 255, 255)"} />
                            : <FlashOff
                                width={cameraSettingsIconSize - 4}
                                height={cameraSettingsIconSize - 4}
                                fill={"rgb(255, 255, 255)"} />}
                </ButtonSettingsBase>

                <ButtonSettingsBase onPress={changeWhiteBalance} activeOpacity={0.5}>
                    {(props.cameraAttributes.whiteBalance === "auto")
                        ? <WBAuto
                            width={cameraSettingsIconSize}
                            height={cameraSettingsIconSize}
                            fill={"rgb(255, 255, 255)"} />
                        : (props.cameraAttributes.whiteBalance === "sunny")
                            ? <WBSun
                                width={cameraSettingsIconSize}
                                height={cameraSettingsIconSize}
                                fill={"rgb(255, 255, 255)"} />
                            : (props.cameraAttributes.whiteBalance === "cloudy")
                                ? <WBCloud
                                    width={cameraSettingsIconSize}
                                    height={cameraSettingsIconSize}
                                    fill={"rgb(255, 255, 255)"} />
                                : (props.cameraAttributes.whiteBalance === "fluorescent")
                                    ? <WBFluorescent
                                        width={cameraSettingsIconSize}
                                        height={cameraSettingsIconSize}
                                        fill={"rgb(255, 255, 255)"} />
                                    : <WBIncandescent
                                        width={cameraSettingsIconSize}
                                        height={cameraSettingsIconSize}
                                        fill={"rgb(255, 255, 255)"} />}
                </ButtonSettingsBase>

                <ButtonSettings
                    iconName={"md-refresh-outline"}
                    onPress={resetCameraSettings}
                />
            </ScrollView>
        </Modal>
    )
}

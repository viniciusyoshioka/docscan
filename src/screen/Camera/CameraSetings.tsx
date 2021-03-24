import React, { useCallback, useState } from "react"
import { ScrollView } from "react-native"

import ChangeFocus from "./ChangeFocus"
import { ButtonSettings, cameraSettingsIconSize } from "../../component/CameraSettings"
import { Modal, ModalProps } from "../../component/Modal"
import { settingsDefaultCamera } from "../../service/constant"
import { flashType, SettingsCameraProps, whiteBalanceType } from "../../service/object-types"
import { readSettings, writeSettings } from "../../service/storage"

import FlashAuto from "../../image/icon/flash-auto.svg"
import FlashOn from "../../image/icon/flash-on.svg"
import FlashOff from "../../image/icon/flash-off.svg"
import WBAuto from "../../image/icon/wb-auto.svg"
import WBCloud from "../../image/icon/wb-cloud.svg"
import WBFluorescent from "../../image/icon/wb-fluorescent.svg"
import WBIncandescent from "../../image/icon/wb-incandescent.svg"
import WBSun from "../../image/icon/wb-sun.svg"
import Focus from "../../image/icon/focus.svg"


export interface CameraSettingsProps extends ModalProps {
    cameraAttributes: SettingsCameraProps,
    buttonFunctions: {
        setFlash: (newFlashMode: flashType) => void,
        setFocus: (newFocus: number) => void,
        setWhiteBalance: (newWhiteBalance: whiteBalanceType) => void,
    }
}


export default function CameraSettings(props: CameraSettingsProps) {


    const [focusModalVisible, setFocusModalVisible] = useState(false)


    const changeFlash = useCallback(async () => {
        // Change attribute
        let newFlash: flashType = "auto"
        if (props.cameraAttributes.flash === "auto") {
            newFlash = "on"
        } else if (props.cameraAttributes.flash === "on") {
            newFlash = "off"
        } else if (props.cameraAttributes.flash === "off") {
            newFlash = "auto"
        }
        // Set camera attribute
        props.buttonFunctions.setFlash(newFlash)
        // Write settings
        const currentSettings = await readSettings()
        currentSettings.camera.flash = newFlash
        await writeSettings(currentSettings)
    }, [props.cameraAttributes.flash])

    const writeChangedFocus = useCallback(async (value) => {
        // Write settings
        const currentSettings = await readSettings()
        currentSettings.camera.focus = value
        await writeSettings(currentSettings)
    }, [])

    const changeWhiteBalance = useCallback(async () => {
        // Change attribute
        let newWhiteBalance: whiteBalanceType = "auto"
        if (props.cameraAttributes.whiteBalance === "auto") {
            newWhiteBalance = "sunny"
        } else if (props.cameraAttributes.whiteBalance === "sunny") {
            newWhiteBalance = "cloudy"
        } else if (props.cameraAttributes.whiteBalance === "cloudy") {
            newWhiteBalance = "fluorescent"
        } else if (props.cameraAttributes.whiteBalance === "fluorescent") {
            newWhiteBalance = "incandescent"
        } else if (props.cameraAttributes.whiteBalance === "incandescent") {
            newWhiteBalance = "auto"
        }
        // Set camera attribute
        props.buttonFunctions.setWhiteBalance(newWhiteBalance)
        // Write settings
        const currentSettings = await readSettings()
        currentSettings.camera.whiteBalance = newWhiteBalance
        await writeSettings(currentSettings)
    }, [props.cameraAttributes.whiteBalance])

    const resetCameraSettings = useCallback(async () => {
        props.buttonFunctions.setFlash(settingsDefaultCamera.flash)
        props.buttonFunctions.setFocus(settingsDefaultCamera.focus)
        props.buttonFunctions.setWhiteBalance(settingsDefaultCamera.whiteBalance)

        const currentSettings = await readSettings()
        currentSettings.camera = settingsDefaultCamera
        await writeSettings(currentSettings)
    }, [])


    return (
        <Modal 
            {...props} 
            modalStyle={{margin: 5}}
            backgroundStyle={{position: "absolute", bottom: 60}}
        >
            <>
                <ChangeFocus 
                    visible={focusModalVisible} 
                    setVisible={setFocusModalVisible} 
                    modalStyle={{marginHorizontal: 50}}
                    backgroundStyle={{position: "absolute", bottom: 130}}
                    value={props.cameraAttributes.focus} 
                    onSliderValueChange={props.buttonFunctions.setFocus} 
                    onSliderReleased={writeChangedFocus} />

                <ScrollView horizontal={true}>
                    <ButtonSettings onPress={async () => await changeFlash()}>
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
                    </ButtonSettings>

                    <ButtonSettings onPress={() => setFocusModalVisible(true)}>
                        <Focus 
                            width={cameraSettingsIconSize} 
                            height={cameraSettingsIconSize} 
                            fill={"rgb(255, 255, 255)"} />
                    </ButtonSettings>

                    <ButtonSettings onPress={async () => await changeWhiteBalance()}>
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
                    </ButtonSettings>

                    <ButtonSettings 
                        iconName={"md-refresh-outline"} 
                        onPress={async () => await resetCameraSettings()}
                    />
                </ScrollView>
            </>
        </Modal>
    )
}
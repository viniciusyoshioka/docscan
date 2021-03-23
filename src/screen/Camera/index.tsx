import React, { useCallback, useEffect, useRef, useState } from "react"
import { BackHandler } from "react-native"
import { RNCamera } from "react-native-camera"
import { useNavigation } from "@react-navigation/native"
import Orientation from "react-native-orientation-locker"

import { SafeScreen } from "../../component/Screen"
import CameraHeader from "./Header"
import CameraSettings from "./CameraSetings"
import { settingsDefaultCamera } from "../../service/constant"
import { readSettings } from "../../service/storage"


export default function Camera() {


    const navigation = useNavigation()
    const cameraRef = useRef<RNCamera>(null)

    const [cameraSettingsVisible, setCameraSettingsVisible] = useState(false)
    const [cameraSettings, setCameraSettings] = useState(settingsDefaultCamera)
    const [flash, setFlash] = useState(cameraSettings.flash)
    const [focus, setFocus] = useState(cameraSettings.focus)
    const [whiteBalance, setWhiteBalance] = useState(cameraSettings.whiteBalance)


    const readCameraSettings = useCallback(async () => {
        // Read camera settings
        const currentSettings = await readSettings()
        setCameraSettings(currentSettings.camera)
        // Set camera attributes
        setFlash(currentSettings.camera.flash)
        setFocus(currentSettings.camera.focus)
        setWhiteBalance(currentSettings.camera.whiteBalance)
    }, [])

    const goBack = useCallback(() => {
        navigation.navigate("Home")
    }, [])

    const backhandlerFunction = useCallback(() => {
        goBack()
        return true
    }, [])

    const setBackhandler = useCallback(() => {
        BackHandler.addEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }, [])

    const removeBackhandler = useCallback(() => {
        BackHandler.removeEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }, [])


    useEffect(() => {
        readCameraSettings()

        Orientation.lockToPortrait()
        return () => {
            Orientation.unlockAllOrientations()
        }
    }, [])

    useEffect(() => {
        setBackhandler()

        return () => {
            removeBackhandler()
        }
    }, [])

    useEffect(() => {
        navigation.addListener("focus", setBackhandler)

        return () => {
            navigation.removeListener("focus", setBackhandler)
        }
    }, [])

    useEffect(() => {
        navigation.addListener("blur", removeBackhandler)

        return () => {
            navigation.removeListener("blur", removeBackhandler)
        }
    }, [])


    return (
        <SafeScreen>
            <CameraSettings
                visible={cameraSettingsVisible}
                setVisible={setCameraSettingsVisible}
                cameraAttributes={{flash, focus, whiteBalance}}
                buttonFunctions={{setFlash, setFocus, setWhiteBalance}}
            />

            <RNCamera
                style={{flex: 1}}
                ref={cameraRef}
                captureAudio={false}
                playSoundOnCapture={false}
                type={"back"}
                useNativeZoom={true}
                flashMode={flash}
                focusDepth={focus}
                whiteBalance={whiteBalance}
            />

            {/* <View style={{flex: 1, backgroundColor: "rgb(180, 180, 180)"}} /> */}

            <CameraHeader 
                goBack={goBack} 
                openSettings={() => setCameraSettingsVisible(true)}
            />
        </SafeScreen>
    )
}

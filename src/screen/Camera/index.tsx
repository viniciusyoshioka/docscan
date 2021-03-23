import React, { useCallback, useEffect, useRef } from "react"
import { Alert, BackHandler } from "react-native"
import { RNCamera } from "react-native-camera"
import { useNavigation } from "@react-navigation/native"
import Orientation from "react-native-orientation-locker"

import { SafeScreen } from "../../component/Screen"


export default function Camera() {


    const navigation = useNavigation()
    const cameraRef = useRef<RNCamera>(null)


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
            <RNCamera
                style={{flex: 1}}
                ref={cameraRef}
                captureAudio={false}
                playSoundOnCapture={false}
                type={"back"}
                useNativeZoom={true}
            />

            {/* <View style={{flex: 1, backgroundColor: "rgb(180, 180, 180)"}} /> */}
        </SafeScreen>
    )
}

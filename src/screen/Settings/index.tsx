import React, { useCallback, useEffect } from "react"
import { BackHandler } from "react-native"
import { useNavigation } from "@react-navigation/core"

import { SafeScreen } from "../../component/Screen"
import SettingsHeader from "./Header"
import { TextVersion, ViewVersion } from "./style"
import { appFName, appType, appVersion } from "../../service/constant"
import { SettingsButton } from "../../component/SettingsButton"


export default function Settings() {


    const navigation = useNavigation()


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
            () => backhandlerFunction()
        )
    }, [])

    const removeBackhandler = useCallback(() => {
        BackHandler.removeEventListener(
            "hardwareBackPress", 
            () => backhandlerFunction()
        )
    }, [])


    useEffect(() => {
        setBackhandler()

        return () => {
            removeBackhandler()
        }
    }, [])


    return (
        <SafeScreen>
            <SettingsHeader
                goBack={goBack}
            />

            <SettingsButton
                title={"Tema"}
                description={"Mudar tema de cores do aplicativo"}
            />

            <ViewVersion>
                <TextVersion>
                    {appFName} - {appVersion} - {appType}
                </TextVersion>
            </ViewVersion>
        </SafeScreen>
    )
}

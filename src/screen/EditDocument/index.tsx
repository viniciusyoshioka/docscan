import React, { useCallback, useEffect } from "react"
import { BackHandler } from "react-native"
import { useNavigation } from "@react-navigation/core"

import { SafeScreen } from "../../component/Screen"
import EditDocumentHeader from "./Header"


export default function EditDocument() {


    const navigation = useNavigation()


    const goBack = useCallback(() => {
        navigation.navigate("Camera")
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
        navigation.addListener("focus", setBackhandler)

        return () => {
            navigation.removeListener("focus", setBackhandler)
        }
    }, [setBackhandler])

    useEffect(() => {
        navigation.addListener("blur", removeBackhandler)

        return () => {
            navigation.removeListener("blur", removeBackhandler)
        }
    }, [removeBackhandler])


    return (
        <SafeScreen>
            <EditDocumentHeader
                goBack={goBack}
            />
        </SafeScreen>
    )
}

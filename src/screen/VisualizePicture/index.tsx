import React, { useCallback, useEffect } from "react"
import { BackHandler, Image } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"

import VisualizePictureHeader from "./Header"
import { SafeScreen } from "../../component/Screen"


type VisualizePictureParams = {
    VisualizePicture: {
        picturePath: string,
    }
}


export default function VisualizePicture() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<VisualizePictureParams, "VisualizePicture">>()


    const goBack = useCallback(() => {
        navigation.goBack()
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
    }, [])

    useEffect(() => {
        navigation.addListener("blur", removeBackhandler)

        return () => {
            navigation.removeListener("blur", removeBackhandler)
        }
    }, [])


    return (
        <SafeScreen>
            <VisualizePictureHeader goBack={() => goBack()} />

            <Image
                source={{uri: `file://${params.picturePath}`}}
                style={{
                    flex: 1,
                    // aspectRatio: 1,
                    resizeMode: "contain",
                    margin: 15,
                    // padding: 15,
                }}
            />
        </SafeScreen>
    )
}

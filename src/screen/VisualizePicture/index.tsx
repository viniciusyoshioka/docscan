import React, { useCallback } from "react"
import { Image } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useBackHandler } from "@react-native-community/hooks"

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


    useBackHandler(() => {
        goBack()
        return true
    })


    const goBack = useCallback(() => {
        navigation.goBack()
    }, [])


    return (
        <SafeScreen>
            <VisualizePictureHeader
                goBack={goBack}
            />

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

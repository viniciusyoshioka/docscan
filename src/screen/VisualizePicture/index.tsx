import React, { useCallback, useRef, useState } from "react"
import { Alert, Image } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import { ImageCrop, OnImageSavedResponse } from "react-native-image-crop"

import { VisualizePictureHeader } from "./Header"
import { SafeScreen } from "../../component"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { ScreenParams } from "../../service/screen-params"
import { fullPathPicture } from "../../service/constant"
import { getDateTime } from "../../service/date"


export function VisualizePicture() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ScreenParams, "VisualizePicture">>()

    const cropViewRef = useRef<ImageCrop>(null)
    const [isCropping, setIsCropping] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    const goBack = useCallback(() => {
        if (isCropping) {
            setIsCropping(false)
            return
        }

        navigation.navigate("EditDocument", {
            document: params.document,
            documentName: params.documentName,
            pictureList: params.pictureList,
            isChanged: params.isChanged,
        })
    }, [params, isCropping])

    const onImageSaved = useCallback(async (response: OnImageSavedResponse) => {
        try {
            const newCroppedPictureUri = `${fullPathPicture}/${getDateTime("", "", true).replace(" ", "_")}.jpg`
            params.pictureList[params.pictureIndex] = newCroppedPictureUri
            await RNFS.unlink(params.picturePath)
            await RNFS.moveFile(response.uri, newCroppedPictureUri)
        } catch (error) {
            params.pictureList[params.pictureIndex] = params.picturePath
            if (await RNFS.exists(response.uri)) {
                await RNFS.unlink(response.uri)
            }

            log("ERROR", `VisualizePicture onImageSaved - Erro movendo arquivo. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Não foi possível salvar imagem cortada"
            )
            setIsCropping(false)
            return
        }

        navigation.navigate("EditDocument", {
            document: params.document,
            documentName: params.documentName,
            pictureList: params.pictureList,
            isChanged: true,
        })
    }, [params])

    const onSaveImageError = useCallback((response: string) => {
        log("ERROR", `VisualizePicture onSaveImageError - Erro ao cortar imagem. Mensagem: "${response}"`)
        Alert.alert(
            "Erro",
            "Não foi possível cortar imagem"
        )
        setIsCropping(false)
    }, [])

    const openCamera = useCallback(() => {
        navigation.navigate("Camera", {
            document: params.document,
            documentName: params.documentName,
            pictureList: params.pictureList,
            screenAction: "replace-picture",
            replaceIndex: params.pictureIndex,
            picturePath: params.picturePath,
        })
    }, [params])


    return (
        <SafeScreen>
            <VisualizePictureHeader
                goBack={goBack}
                isCropping={isCropping}
                openCamera={openCamera}
                setIsCropping={setIsCropping}
                saveCroppedPicture={() => cropViewRef.current?.saveImage()}
            />

            {!isCropping && (
                <Image
                    source={{ uri: `file://${params.picturePath}` }}
                    style={{
                        flex: 1,
                        resizeMode: "contain",
                        margin: 16,
                    }}
                />
            )}

            {isCropping && (
                <ImageCrop
                    ref={cropViewRef}
                    style={{
                        flex: 1,
                        margin: 16,
                    }}
                    sourceUrl={`file://${params.picturePath}`}
                    onSaveImage={onImageSaved}
                    onCropError={onSaveImageError}
                />
            )}
        </SafeScreen>
    )
}

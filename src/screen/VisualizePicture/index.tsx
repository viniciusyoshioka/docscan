import React, { useCallback, useRef, useState } from "react"
import { Alert, Image } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import RNFS from "react-native-fs"

import { ImageCrop, imageSavedResponse } from "../../service/image-crop"
import { VisualizePictureHeader } from "./Header"
import { SafeScreen } from "../../component/Screen"
import { useBackHandler } from "../../service/hook"
import { fullPathPictureCropped } from "../../service/constant"
import { log } from "../../service/log"
import { ScreenParams } from "../../service/screen-params"


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
    }, [isCropping])

    const onImageSaved = useCallback(async (response: imageSavedResponse) => {
        // Split file path
        const splitedPath = params.picturePath.split("/")
        const fileName = splitedPath[splitedPath.length - 1]
        // Get file name
        const splitedFileName = fileName.split(".")
        let name = ""
        splitedFileName.forEach((item, index) => {
            if (index !== splitedFileName.length - 1) {
                name += item
            }
        })
        // Get file extension
        const extension = splitedFileName[splitedFileName.length - 1]
        // Get new path to cropped image
        const filePath = `${fullPathPictureCropped}/${name}.${extension}`

        try {
            await RNFS.moveFile(response.uri, filePath)
        } catch (error) {
            await RNFS.unlink(response.uri)

            log("ERROR", `VisualizePicture onImageSaved - Error moving file. Message: "${error}"`)
            Alert.alert(
                "Erro ao salvar imagem",
                "Não foi possível salvar imagem cortada"
            )
            navigation.navigate("EditDocument", {
                document: params.document,
                documentName: params.documentName,
                pictureList: params.pictureList,
            })
            return
        }

        try {
            await RNFS.unlink(params.picturePath)
        } catch (error) {
            log("ERROR", `VisualizePicture onImageSaved - Error deleting original image file. Message: "${error}"`)
            Alert.alert(
                "Erro ao apagar imagem original",
                "Não foi possível apagar a imagem original após cortá-la"
            )
        }

        params.pictureList[params.pictureIndex] = filePath

        navigation.navigate("EditDocument", {
            document: params.document,
            documentName: params.documentName,
            pictureList: params.pictureList,
            isChanged: true,
        })
    }, [])

    const onSaveImageError = useCallback((response: string) => {
        log("ERROR", `VisualizePicture onSaveImageError - Erro ao cortar imagem. Mensagem: "${response}"`)
        Alert.alert(
            "Falha",
            "Não foi possível cortar imagem"
        )
    }, [])

    const openCamera = useCallback(() => {
        navigation.navigate("Camera", {
            document: params.document,
            documentName: params.documentName,
            pictureList: params.pictureList,
            screenAction: "replace-picture",
            replaceIndex: params.pictureIndex
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
                    source={{uri: `file://${params.picturePath}`}}
                    style={{
                        flex: 1,
                        resizeMode: "contain",
                        margin: 15,
                    }}
                />
            )}

            {isCropping && (
                <ImageCrop
                    ref={cropViewRef}
                    style={{
                        flex: 1,
                        margin: 15,
                    }}
                    sourceUrl={`file://${params.picturePath}`}
                    onImageSaved={onImageSaved}
                    onSaveImageError={onSaveImageError}
                />
            )}
        </SafeScreen>
    )
}

import React, { useCallback, useRef, useState } from "react"
import { Alert, FlatList, useWindowDimensions } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import { ImageCrop, OnImageSavedResponse } from "react-native-image-crop"

import { VisualizePictureHeader } from "./Header"
import { ImageVisualizationItem, SafeScreen } from "../../component"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { fullPathPicture } from "../../service/constant"
import { getDateTime } from "../../service/date"
import { NavigationParamProps, RouteParamProps } from "../../types/screen-params"


export function VisualizePicture() {


    const navigation = useNavigation<NavigationParamProps<"VisualizePicture">>()
    const { params } = useRoute<RouteParamProps<"VisualizePicture">>()
    const { width } = useWindowDimensions()

    const cropViewRef = useRef<ImageCrop>(null)
    const imageFlatListRef = useRef<FlatList>(null)
    const [isCropping, setIsCropping] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(params.pictureIndex)
    const [isFlatListScrollEnable, setIsFlatListScrollEnable] = useState(true)


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
        const currentPicturePath = params.pictureList[currentIndex]
        try {
            const newCroppedPictureUri = `${fullPathPicture}/${getDateTime("", "", true).replace(" ", "_")}.jpg`
            params.pictureList[currentIndex] = newCroppedPictureUri
            await RNFS.unlink(currentPicturePath)
            await RNFS.moveFile(response.uri, newCroppedPictureUri)
        } catch (error) {
            params.pictureList[currentIndex] = currentPicturePath
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
    }, [params, currentIndex])

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
            replaceIndex: currentIndex,
        })
    }, [params, currentIndex])

    function renderImageVisualizationItem({ item }: { item: string }) {
        return (
            <ImageVisualizationItem
                source={{ uri: `file://${item}` }}
                onZoomActivated={() => {
                    setIsFlatListScrollEnable(false)
                }}
                onZoomDeactivated={() => {
                    setIsFlatListScrollEnable(true)
                }}
            />
        )
    }


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
                <FlatList
                    ref={imageFlatListRef}
                    data={params.pictureList}
                    renderItem={renderImageVisualizationItem}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={isFlatListScrollEnable}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    initialScrollIndex={currentIndex}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        setCurrentIndex(nativeEvent.contentOffset.x / width)
                    }}
                    onLayout={() => {
                        imageFlatListRef.current?.scrollToOffset({
                            animated: false,
                            offset: currentIndex * width,
                        })
                    }}
                />
            )}

            {isCropping && (
                <ImageCrop
                    ref={cropViewRef}
                    style={{ flex: 1 }}
                    sourceUrl={`file://${params.pictureList[currentIndex]}`}
                    onSaveImage={onImageSaved}
                    onCropError={onSaveImageError}
                />
            )}
        </SafeScreen>
    )
}

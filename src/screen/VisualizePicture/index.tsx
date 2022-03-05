import React, { useRef, useState } from "react"
import { Alert, FlatList, useWindowDimensions } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import { ImageCrop, OnImageSavedResponse } from "react-native-image-crop"
import "react-native-get-random-values"
import { v4 as uuid4 } from "uuid"

import { SafeScreen } from "../../components"
import { DocumentDatabase } from "../../database"
import { useBackHandler } from "../../hooks"
import { fullPathPicture } from "../../services/constant"
import { getFileExtension, getFullFileName, useDocumentData } from "../../services/document"
import { log } from "../../services/log"
import { DocumentPicture, NavigationParamProps, RouteParamProps } from "../../types"
import { VisualizePictureHeader } from "./Header"
import { ImageVisualizationItem } from "./ImageVisualizationItem"


export function VisualizePicture() {


    const navigation = useNavigation<NavigationParamProps<"VisualizePicture">>()
    const { params } = useRoute<RouteParamProps<"VisualizePicture">>()
    const { width } = useWindowDimensions()

    const cropViewRef = useRef<ImageCrop>(null)
    const imageFlatListRef = useRef<FlatList>(null)

    const { documentDataState, dispatchDocumentData } = useDocumentData()
    const [isCropping, setIsCropping] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(params.pictureIndex)
    const [isFlatListScrollEnable, setIsFlatListScrollEnable] = useState(true)


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        if (isCropping) {
            setIsCropping(false)
            return
        }

        navigation.navigate("EditDocument")
    }

    async function onImageSaved(response: OnImageSavedResponse) {
        const currentPicturePath = documentDataState?.pictureList[currentIndex].filePath
        if (!currentPicturePath) {
            log.warn("A imagem atual a ser substituída não existe")
            Alert.alert(
                "Erro",
                "A imagem atual a ser substituída não existe"
            )
            return
        }
        const currentPictureName = getFullFileName(currentPicturePath)

        try {
            let newCroppedPictureUri: string
            let newCroppedPictureName: string

            do {
                const uniqueFileName = uuid4()
                const fileExtension = getFileExtension(response.uri)

                newCroppedPictureUri = `${fullPathPicture}/${uniqueFileName}.${fileExtension}`
                newCroppedPictureName = getFullFileName(newCroppedPictureUri)
            } while (await DocumentDatabase.pictureNameExists(newCroppedPictureName))

            dispatchDocumentData({
                type: "replace-picture",
                payload: {
                    indexToReplace: currentIndex,
                    newPicturePath: newCroppedPictureUri,
                    newPictureName: newCroppedPictureName,
                }
            })

            if (await RNFS.exists(currentPicturePath)) {
                await RNFS.unlink(currentPicturePath)
            }
            await RNFS.moveFile(response.uri, newCroppedPictureUri)
        } catch (error) {
            dispatchDocumentData({
                type: "replace-picture",
                payload: {
                    indexToReplace: currentIndex,
                    newPicturePath: currentPicturePath,
                    newPictureName: currentPictureName,
                }
            })

            if (await RNFS.exists(response.uri)) {
                await RNFS.unlink(response.uri)
            }

            log.error(`VisualizePicture onImageSaved - Erro movendo arquivo. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Não foi possível salvar imagem cortada"
            )
            setIsCropping(false)
            return
        }

        navigation.navigate("EditDocument")
    }

    function onSaveImageError(response: string) {
        log.error(`VisualizePicture onSaveImageError - Erro ao cortar imagem. Mensagem: "${response}"`)
        Alert.alert(
            "Erro",
            "Não foi possível cortar imagem"
        )
        setIsCropping(false)
    }

    function openCamera() {
        navigation.navigate("Camera", {
            screenAction: "replace-picture",
            replaceIndex: currentIndex,
        })
    }

    function renderItem({ item }: { item: DocumentPicture }) {
        return (
            <ImageVisualizationItem
                source={{ uri: `file://${item.filePath}` }}
            // onZoomActivated={() => {
            //     setIsFlatListScrollEnable(false)
            // }}
            // onZoomDeactivated={() => {
            //     setIsFlatListScrollEnable(true)
            // }}
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
                    data={documentDataState?.pictureList}
                    renderItem={renderItem}
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
                    sourceUrl={`file://${documentDataState?.pictureList[currentIndex].filePath}`}
                    onSaveImage={onImageSaved}
                    onCropError={onSaveImageError}
                />
            )}
        </SafeScreen>
    )
}

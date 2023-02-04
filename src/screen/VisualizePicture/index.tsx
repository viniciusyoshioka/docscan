import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useState } from "react"
import { Alert, useWindowDimensions, View } from "react-native"
import "react-native-get-random-values"
// import { ImageCrop, OnImageSavedResponse } from "react-native-image-crop"

import { Screen } from "../../components"
import { useBackHandler } from "../../hooks"
import { translate } from "../../locales"
import { useDocumentData } from "../../services/document"
import { log } from "../../services/log"
import { DocumentPicture, NavigationParamProps, RouteParamProps } from "../../types"
import { VisualizePictureHeader } from "./Header"
import { ImageVisualizationItem } from "./ImageVisualizationItem"


// TODO improve screen design
// TODO add button to rotate the image
// TODO fix scroll not centralized when rotating screen
export function VisualizePicture() {


    const navigation = useNavigation<NavigationParamProps<"VisualizePicture">>()
    const { params } = useRoute<RouteParamProps<"VisualizePicture">>()
    const { width } = useWindowDimensions()

    // const cropViewRef = useRef<ImageCrop>(null)

    const { documentDataState, dispatchDocumentData } = useDocumentData()

    const [isCropping, setIsCropping] = useState(false)
    const [isCropProcessing, setIsCropProcessing] = useState(false)
    const [isRotating, setIsRotating] = useState(false)
    const [isRotationProcessing, setIsRotationProcessing] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(params.pictureIndex)
    const [isFlatListScrollEnable, setIsFlatListScrollEnable] = useState(true)


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        if (isCropping) {
            exitCrop()
            return
        }
        if (isRotating) {
            exitRotation()
            return
        }

        navigation.goBack()
    }

    function replacePicture() {
        navigation.navigate("Camera", {
            screenAction: "replace-picture",
            replaceIndex: currentIndex,
        })
    }

    function exitCrop() {
        if (!isCropProcessing) {
            setIsCropping(false)
        }
    }

    function saveCroppedPicture() {
        if (!isCropProcessing) {
            setIsCropProcessing(true)
            // cropViewRef.current?.saveImage()
        }
    }

    function exitRotation() {
        if (!isRotationProcessing) {
            setIsRotating(false)
        }
    }

    function saveRotatedPicture() {
        if (!isRotationProcessing) {
            setIsRotationProcessing(true)
            // TODO rotate the image and save it
        }
    }

    function renderItem({ item }: { item: DocumentPicture }) {
        return (
            <ImageVisualizationItem
                source={{ uri: `file://${item.filePath}` }}
                onZoomActivated={() => setIsFlatListScrollEnable(false)}
                onZoomDeactivated={() => setIsFlatListScrollEnable(true)}
            />
        )
    }

    // async function onCroppedImageSaved(response: OnImageSavedResponse) {
    //     const currentPicturePath = documentDataState?.pictureList[currentIndex].filePath

    //     if (!currentPicturePath) {
    //         log.warn("Current image to be replaced does not exists")
    //         Alert.alert(
    //             translate("warn"),
    //             translate("VisualizePicture_alert_warnCurrentPicture_text")
    //         )
    //         return
    //     }

    //     try {
    //         let newCroppedPictureUri: string
    //         let newCroppedPictureName: string

    //         do {
    //             const uniqueFileName = uuid4()
    //             const fileExtension = getFileExtension(response.uri)

    //             newCroppedPictureUri = `${fullPathPicture}/${uniqueFileName}.${fileExtension}`
    //             newCroppedPictureName = getFullFileName(newCroppedPictureUri)
    //         } while (await DocumentDatabase.pictureNameExists(newCroppedPictureName))

    //         if (await RNFS.exists(currentPicturePath)) {
    //             await RNFS.unlink(currentPicturePath)
    //         }
    //         await RNFS.moveFile(response.uri, newCroppedPictureUri)

    //         dispatchDocumentData({
    //             type: "replace-picture",
    //             payload: {
    //                 indexToReplace: currentIndex,
    //                 newPicturePath: newCroppedPictureUri,
    //                 newPictureName: newCroppedPictureName,
    //             }
    //         })
    //     } catch (error) {
    //         if (await RNFS.exists(response.uri)) {
    //             await RNFS.unlink(response.uri)
    //         }

    //         log.error(`Error replacing image by cropped image: "${stringfyError(error)}"`)
    //         Alert.alert(
    //             translate("warn"),
    //             translate("VisualizePicture_alert_errorSavingCroppedImage_text")
    //         )
    //     }
    //     setIsCropping(false)
    //     setIsCropProcessing(false)
    // }

    function onCropError(response: string) {
        log.error(`Error cropping image: "${response}"`)
        Alert.alert(
            translate("warn"),
            translate("VisualizePicture_alert_errorCroppingImage_text")
        )
        setIsCropping(false)
        setIsCropProcessing(false)
    }


    return (
        <Screen>
            <VisualizePictureHeader
                goBack={goBack}
                replacePicture={replacePicture}
                rotation={{
                    isActive: isRotating,
                    open: () => setIsRotating(true),
                    exit: exitRotation,
                    save: saveRotatedPicture,
                    rotateLeft: () => {}, // TODO implement rotation to the left
                    rotateRight: () => {}, // TODO implement rotation to the right
                }}
                crop={{
                    isActive: isCropping,
                    open: () => setIsCropping(true),
                    exit: exitCrop,
                    save: saveCroppedPicture,
                }}
            />

            {!isRotating && !isCropping && (
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <FlashList
                        data={documentDataState?.pictureList}
                        renderItem={renderItem}
                        estimatedItemSize={width}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        initialScrollIndex={currentIndex}
                        scrollEnabled={isFlatListScrollEnable}
                        onMomentumScrollEnd={({ nativeEvent }) => {
                            const newCurrentIndex = nativeEvent.contentOffset.x / width
                            if (currentIndex !== newCurrentIndex) {
                                setCurrentIndex(newCurrentIndex)
                            }
                        }}
                    />
                </View>
            )}

            {/* {isCropping && (
                <ImageCrop
                    ref={cropViewRef}
                    style={{ flex: 1, margin: 16 }}
                    sourceUrl={`file://${documentDataState?.pictureList[currentIndex].filePath}`}
                    onSaveImage={onCroppedImageSaved}
                    onCropError={onCropError}
                />
            )} */}
        </Screen>
    )
}

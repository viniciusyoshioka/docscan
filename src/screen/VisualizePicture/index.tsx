import { Screen } from "@elementium/native"
import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useRef, useState } from "react"
import { Alert, View, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { v4 as uuid4 } from "uuid"

import { DocumentPictureSchema, DocumentSchema, useDocumentModel, useDocumentRealm } from "../../database"
import { useBackHandler } from "../../hooks"
import { translate } from "../../locales"
import { fullPathPicture } from "../../services/constant"
import { DocumentService } from "../../services/document"
import { ImageCrop, OnImageSavedResponse } from "../../services/image-crop"
import { log, stringfyError } from "../../services/log"
import { NavigationParamProps, RouteParamProps } from "../../types"
import { VisualizePictureHeader } from "./Header"
import { ImageRotation, ImageRotationRef } from "./ImageRotation"
import { ImageVisualizationItem } from "./ImageVisualizationItem"


// TODO improve screen design
// TODO fix scroll not centralized when rotating screen
// TODO fix image not updating after replacing it
export function VisualizePicture() {


    const navigation = useNavigation<NavigationParamProps<"VisualizePicture">>()
    const { params } = useRoute<RouteParamProps<"VisualizePicture">>()
    const { width } = useWindowDimensions()

    const documentRealm = useDocumentRealm()
    const { documentModel, setDocumentModel } = useDocumentModel()

    const imageRotationRef = useRef<ImageRotationRef>(null)
    const imageCropRef = useRef<ImageCrop>(null)

    const [isRotating, setIsRotating] = useState(false)
    const [isRotationProcessing, setIsRotationProcessing] = useState(false)
    const [isCropping, setIsCropping] = useState(false)
    const [isCropProcessing, setIsCropProcessing] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(params.pictureIndex)
    const [isFlatListScrollEnable, setIsFlatListScrollEnable] = useState(true)


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        if (isRotating) {
            exitRotation()
            return
        }
        if (isCropping) {
            exitCrop()
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

    function exitRotation() {
        if (!isRotationProcessing)
            setIsRotating(false)
    }

    function rotateLeft() {
        if (!isRotationProcessing)
            imageRotationRef.current?.rotateLeft()
    }

    function rotateRight() {
        if (!isRotationProcessing)
            imageRotationRef.current?.rotateRight()
    }

    async function saveRotatedPicture() {
        if (isRotationProcessing || !documentModel) return

        setIsRotationProcessing(true)

        const picturePathToRotate = documentModel.pictures[currentIndex].filePath
        const picturePathRotated = await DocumentService.getPicturePath(picturePathToRotate)
        try {
            await imageRotationRef.current?.save(picturePathRotated)
            replaceImage(picturePathRotated)

            setIsRotating(false)
            setIsRotationProcessing(false)
        } catch (error) {
            log.error(`Error saving rotated picture: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("VisualizePicture_alert_errorSavingRotatedImage_text")
            )

            setIsRotating(false)
            setIsRotationProcessing(false)
            return
        }

        try {
            RNFS.unlink(picturePathToRotate)
        } catch (error) {
            log.warn(`Error deleting original image after rotate: "${stringfyError(error)}"`)
        }
    }

    function exitCrop() {
        if (!isCropProcessing)
            setIsCropping(false)
    }

    function saveCroppedPicture() {
        if (!isCropProcessing) {
            setIsCropProcessing(true)
            imageCropRef.current?.saveImage()
        }
    }

    function renderItem({ item }: { item: DocumentPictureSchema }) {
        return (
            <ImageVisualizationItem
                source={{ uri: `file://${item.filePath}` }}
                onZoomActivated={() => setIsFlatListScrollEnable(false)}
                onZoomDeactivated={() => setIsFlatListScrollEnable(true)}
            />
        )
    }

    async function onCroppedImageSaved(response: OnImageSavedResponse) {
        if (!documentModel) return

        const picturePath = documentModel.pictures[currentIndex].filePath
        const fileExtension = DocumentService.getFileExtension(response.uri)

        try {
            let newCroppedPictureUri: string
            let isPicturePathDuplicated = false

            do {
                const uniqueFileName = uuid4()
                newCroppedPictureUri = `${fullPathPicture}/${uniqueFileName}.${fileExtension}`

                isPicturePathDuplicated = documentRealm
                    .objects<DocumentPictureSchema>("DocumentPictureSchema")
                    .filtered("filePath = $0", newCroppedPictureUri)
                    .length > 0
            } while (isPicturePathDuplicated)

            await RNFS.moveFile(response.uri, newCroppedPictureUri)

            replaceImage(newCroppedPictureUri)
        } catch (error) {
            if (await RNFS.exists(response.uri)) {
                await RNFS.unlink(response.uri)
            }

            log.error(`Error replacing image by cropped image: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("VisualizePicture_alert_errorSavingCroppedImage_text")
            )
        } finally {
            setIsCropping(false)
            setIsCropProcessing(false)
        }

        try {
            if (await RNFS.exists(picturePath))
                RNFS.unlink(picturePath)
        } catch (error) {
            log.warn(`Error deleting original image after crop: "${stringfyError(error)}"`)
        }
    }

    function onCropError(response: string) {
        log.error(`Error cropping image: "${response}"`)
        Alert.alert(
            translate("warn"),
            translate("VisualizePicture_alert_errorCroppingImage_text")
        )
        setIsCropping(false)
        setIsCropProcessing(false)
    }

    function replaceImage(image: string) {
        if (!documentModel) throw new Error("Document model is undefined. This should not happen")

        documentRealm.write(() => {
            documentModel.document.modifiedAt = Date.now()
            documentModel.pictures[params.pictureIndex].filePath = image
        })

        const document = documentRealm.objectForPrimaryKey(DocumentSchema, documentModel.document.id)
        const pictures = documentRealm
            .objects(DocumentPictureSchema)
            .filtered("belongsToDocument = $0", documentModel.document.id)
            .sorted("position")

        if (!document) throw new Error("Document is undefined, this should not happen")
        setDocumentModel({ document, pictures })
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
                    rotateLeft: rotateLeft,
                    rotateRight: rotateRight,
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
                        data={documentModel?.pictures}
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

            {isRotating && (
                <ImageRotation
                    ref={imageRotationRef}
                    source={`file://${documentModel?.pictures[currentIndex].filePath}`}
                    style={{ flex: 1 }}
                />
            )}

            {isCropping && (
                <ImageCrop
                    ref={imageCropRef}
                    style={{ flex: 1, margin: 16 }}
                    sourceUrl={`file://${documentModel?.pictures[currentIndex].filePath}`}
                    onSaveImage={onCroppedImageSaved}
                    onCropError={onCropError}
                />
            )}
        </Screen>
    )
}

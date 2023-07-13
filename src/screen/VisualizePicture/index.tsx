import { Screen } from "@elementium/native"
import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useMemo, useRef, useState } from "react"
import { Alert, View, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"

import { DocumentPictureSchema, DocumentSchema, useDocumentModel, useDocumentRealm } from "../../database"
import { useBackHandler } from "../../hooks"
import { translate } from "../../locales"
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
    const [isFlatListScrollEnable, setIsFlatListScrollEnable] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(params.pictureIndex)
    const currentPicturePath = useMemo(() => {
        if (!documentModel) throw new Error("Document model is undefined. This should not happen")

        const index = Math.round(currentIndex)
        const fileName = documentModel.pictures[index].fileName
        return DocumentService.getPicturePath(fileName)
    }, [documentModel, currentIndex])


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
        if (isRotationProcessing) return
        if (!documentModel) throw new Error("Document model is undefined. This should not happen")

        const rotatedDegrees = imageRotationRef.current?.getRotationDegree()
        if (rotatedDegrees && (rotatedDegrees % 360) === 0) {
            setIsRotating(false)
            return
        }

        setIsRotationProcessing(true)

        const pictureNameToRotate = documentModel.pictures[currentIndex].fileName
        const picturePathRotated = await DocumentService.getNewPicturePath(pictureNameToRotate)
        try {
            await imageRotationRef.current?.save(picturePathRotated)
            replacePictureInDatabase(picturePathRotated)
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
            const picturePathToDelete = DocumentService.getPicturePath(pictureNameToRotate)
            await RNFS.unlink(picturePathToDelete)
        } catch (error) {
            log.warn(`Error deleting original image after rotate: "${stringfyError(error)}"`)
        }

        setIsRotating(false)
        setIsRotationProcessing(false)
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
        const picturePath = DocumentService.getPicturePath(item.fileName)
        return (
            <ImageVisualizationItem
                source={{ uri: `file://${picturePath}` }}
                onZoomActivated={() => setIsFlatListScrollEnable(false)}
                onZoomDeactivated={() => setIsFlatListScrollEnable(true)}
            />
        )
    }

    async function onCroppedImageSaved(response: OnImageSavedResponse) {
        if (!documentModel) throw new Error("Document model is undefined. This should not happen")

        const pictureName = documentModel.pictures[currentIndex].fileName
        const picturePath = DocumentService.getPicturePath(pictureName)

        try {
            const croppedPicturePath = await DocumentService.getNewPicturePath(response.uri)
            await RNFS.moveFile(response.uri, croppedPicturePath)
            replacePictureInDatabase(croppedPicturePath)
            setIsCropping(false)
            setIsCropProcessing(false)
        } catch (error) {
            if (await RNFS.exists(response.uri)) {
                await RNFS.unlink(response.uri)
            }

            log.error(`Error replacing image by cropped image: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("VisualizePicture_alert_errorSavingCroppedImage_text")
            )

            setIsCropping(false)
            setIsCropProcessing(false)
            return
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

    function replacePictureInDatabase(filePath: string) {
        if (!documentModel) throw new Error("Document model is undefined. This should not happen")

        documentRealm.write(() => {
            documentModel.document.modifiedAt = Date.now()
            documentModel.pictures[params.pictureIndex].fileName = DocumentService.getFileFullname(filePath)
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
                    source={`file://${currentPicturePath}`}
                    style={{ flex: 1 }}
                />
            )}

            {isCropping && (
                <ImageCrop
                    ref={imageCropRef}
                    style={{ flex: 1, margin: 16 }}
                    sourceUrl={`file://${currentPicturePath}`}
                    onSaveImage={onCroppedImageSaved}
                    onCropError={onCropError}
                />
            )}
        </Screen>
    )
}

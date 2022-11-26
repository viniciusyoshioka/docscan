import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll"
import { useNavigation, useRoute } from "@react-navigation/core"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Alert, FlatList, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"

import { EmptyList, HEADER_HEIGHT, Screen } from "../../components"
import { useBackHandler } from "../../hooks"
import { translate } from "../../locales"
import { getDocumentPicturePath, getFullFileName, useDocumentData } from "../../services/document"
import { copyPicturesService } from "../../services/document-service"
import { log, stringfyError } from "../../services/log"
import { getWritePermission } from "../../services/permission"
import { useAppTheme } from "../../services/theme"
import { DocumentPicture, NavigationParamProps, RouteParamProps } from "../../types"
import { GalleryHeader } from "./Header"
import { ImageItem } from "./ImageItem"
import { LoadingIndicator } from "./LoadingIndicator"


export function Gallery() {


    const navigation = useNavigation<NavigationParamProps<"Gallery">>()
    const { params } = useRoute<RouteParamProps<"Gallery">>()

    const { width, height } = useWindowDimensions()

    const { color, opacity } = useAppTheme()

    const { documentDataState, dispatchDocumentData } = useDocumentData()

    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [imageGallery, setImageGallery] = useState<PhotoIdentifier[] | null>(null)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedImages, setSelectedImages] = useState<string[]>([])
    const currentAmountOfImages = useMemo(() => imageGallery?.length ?? 0, [imageGallery])
    const [isGalleryFullLoaded, setIsGalleryFullLoaded] = useState(false)

    const minimumRowAmountInScreen = useMemo(() => Math.ceil((height - HEADER_HEIGHT) / (width / 3)), [width, height])
    const amountOfImageToLoadPerTime = useMemo(() => (minimumRowAmountInScreen + 1) * 3, [minimumRowAmountInScreen])


    useBackHandler(() => {
        goBack()
        return true
    })


    async function getImage(refreshing?: boolean) {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        const hasWritePermission = await getWritePermission()
        if (!hasWritePermission) {
            setImageGallery([])
            setIsLoading(false)
            log.warn("No permission to access CameraRoll")
            Alert.alert(
                translate("warn"),
                translate("Gallery_alert_noPermissionForGallery_text")
            )
            return
        }

        let amoutToLoad = amountOfImageToLoadPerTime
        if (!refreshing && imageGallery) {
            amoutToLoad += imageGallery.length
        }

        try {
            const cameraRollPhotos = await CameraRoll.getPhotos({
                first: amoutToLoad,
                assetType: "Photos",
            })

            if (cameraRollPhotos.edges.length === currentAmountOfImages && !refreshing) {
                setIsGalleryFullLoaded(true)
                setIsLoading(false)
                return
            }

            setImageGallery(cameraRollPhotos.edges)
            setIsLoading(false)
        } catch (error) {
            setImageGallery([])
            setIsLoading(false)
            log.error(`Error getting images from CameraRoll: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Gallery_alert_errorOpeningGallery_text")
            )
        }
    }

    function goBack() {
        if (isSelectionMode) {
            exitSelectionMode()
            return
        }

        if (params?.screenAction === "replace-picture") {
            navigation.reset({
                routes: [
                    { name: "Home" },
                    { name: "EditDocument" },
                    {
                        name: "VisualizePicture",
                        params: {
                            pictureIndex: params.replaceIndex,
                        }
                    },
                    {
                        name: "Camera",
                        params: {
                            screenAction: params.screenAction,
                            replaceIndex: params.replaceIndex,
                        }
                    }
                ]
            })
            return
        }

        navigation.reset({
            routes: [
                { name: "Home" },
                { name: "Camera" }
            ]
        })
    }

    async function importSingleImage(imagePath: string) {
        const hasWritePermission = await getWritePermission()
        if (!hasWritePermission) {
            log.warn("No permission to import image")
            Alert.alert(
                translate("warn"),
                translate("Gallery_alert_noPermissionToImportSingle_text")
            )
            return
        }

        const newImagePath = await getDocumentPicturePath(imagePath)
        const newImageName = getFullFileName(newImagePath)
        try {
            await RNFS.copyFile(imagePath, newImagePath)
        } catch (error) {
            log.error(`Error importing a single image from gallery: "${stringfyError(error)}"`)
            Alert.alert(
                translate("warn"),
                translate("Gallery_alert_unknownErrorImportingSingle_text")
            )
            return
        }

        if (params?.screenAction === "replace-picture") {
            dispatchDocumentData({
                type: "replace-picture",
                payload: {
                    indexToReplace: params.replaceIndex,
                    newPicturePath: newImagePath,
                    newPictureName: newImageName,
                }
            })

            navigation.navigate("VisualizePicture", {
                pictureIndex: params.replaceIndex,
            })
            return
        }

        dispatchDocumentData({
            type: "add-picture",
            payload: [ {
                id: undefined,
                filePath: newImagePath,
                fileName: newImageName,
                position: documentDataState?.pictureList.length || 0
            } ]
        })

        navigation.reset({
            routes: [
                { name: "Home" },
                { name: "Camera" }
            ]
        })
    }

    async function importMultipleImage() {
        const hasWritePermission = await getWritePermission()
        if (!hasWritePermission) {
            log.warn("No permission to import multiple images")
            Alert.alert(
                translate("warn"),
                translate("Gallery_alert_noPermissionToImportMultiple_text")
            )
            return
        }

        const imagesToCopy: string[] = []
        const imagesToImport: DocumentPicture[] = []
        let nextIndex = documentDataState?.pictureList.length ?? 0

        for (let i = 0; i < selectedImages.length; i++) {
            const newImagePath = await getDocumentPicturePath(selectedImages[i])
            const newImageName = getFullFileName(newImagePath)

            imagesToCopy.push(selectedImages[i].replace("file://", ""))
            imagesToCopy.push(newImagePath)

            imagesToImport.push({
                id: undefined,
                filePath: newImagePath,
                fileName: newImageName,
                position: nextIndex
            } as DocumentPicture)

            nextIndex += 1
        }

        copyPicturesService(imagesToCopy)
        dispatchDocumentData({
            type: "add-picture",
            payload: imagesToImport
        })

        navigation.reset({
            routes: [
                { name: "Home" },
                { name: "Camera" }
            ]
        })
    }

    function selectImage(imagePath: string) {
        if (!isSelectionMode) {
            setIsSelectionMode(true)
        }
        if (!selectedImages.includes(imagePath)) {
            setSelectedImages(currentSelectedImages => [...currentSelectedImages, imagePath])
        }
    }

    function deselectImage(imagePath: string) {
        const index = selectedImages.indexOf(imagePath)
        if (index !== -1) {
            const newSelectedImages = [...selectedImages]
            newSelectedImages.splice(index, 1)
            setSelectedImages(newSelectedImages)

            if (isSelectionMode && newSelectedImages.length === 0) {
                setIsSelectionMode(false)
            }
        }
    }

    function exitSelectionMode() {
        setIsSelectionMode(false)
        setSelectedImages([])
    }

    function renderItem({ item }: { item: PhotoIdentifier }) {
        return (
            <ImageItem
                onClick={() => importSingleImage(item.node.image.uri)}
                onSelected={() => selectImage(item.node.image.uri)}
                onDeselected={() => deselectImage(item.node.image.uri)}
                isSelectionMode={isSelectionMode}
                isSelected={selectedImages.includes(item.node.image.uri)}
                imagePath={item.node.image.uri}
                screenAction={params?.screenAction}
            />
        )
    }

    const keyExtractor = useCallback((_: PhotoIdentifier, index: number) => index.toString(), [])

    async function onEndReached() {
        if (isGalleryFullLoaded) {
            return
        }

        const galleryLength = imageGallery?.length ?? 0
        const currentRowAmount = (galleryLength / 3)
        if (currentRowAmount < minimumRowAmountInScreen) {
            return
        }

        await getImage(false)
    }

    function ListFooterComponent() {
        if (isLoading && imageGallery) {
            return <LoadingIndicator />
        }
        return null
    }

    async function onRefresh() {
        exitSelectionMode()
        setIsRefreshing(true)
        setIsGalleryFullLoaded(false)
        await getImage(true)
        setIsRefreshing(false)
    }


    useEffect(() => {
        getImage(false)
    }, [])


    return (
        <Screen>
            <GalleryHeader
                goBack={goBack}
                exitSelectionMode={exitSelectionMode}
                importImage={importMultipleImage}
                isSelectionMode={isSelectionMode}
                selectedImagesAmount={selectedImages.length}
            />

            <FlatList
                data={imageGallery}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3}
                onEndReachedThreshold={0.05}
                onEndReached={onEndReached}
                ListFooterComponent={ListFooterComponent}
                onRefresh={imageGallery?.length ? onRefresh : undefined}
                refreshing={isRefreshing}
                style={{ display: imageGallery?.length ? "flex" : "none" }}
            />

            <EmptyList visible={!imageGallery && !isRefreshing}>
                <ActivityIndicator
                    color={color.screen_color}
                    size={"large"}
                    style={{ opacity: opacity.mediumEmphasis }}
                />
            </EmptyList>

            <EmptyList
                imageSource={require("../../image/empty_gallery.png")}
                message={translate("Gallery_emptyGallery")}
                visible={imageGallery?.length === 0}
            />
        </Screen>
    )
}

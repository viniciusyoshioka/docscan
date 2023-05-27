import { Screen } from "@elementium/native"
import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll"
import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Alert, useWindowDimensions, View } from "react-native"
import RNFS from "react-native-fs"

import { EmptyList, HEADER_HEIGHT } from "../../components"
import { useBackHandler, useSelectionMode } from "../../hooks"
import { translate } from "../../locales"
import { DocumentPicture, DocumentService } from "../../services/document"
import { useDocumentData } from "../../services/document-data"
import { log, stringfyError } from "../../services/log"
import { getReadMediaImagesPermission } from "../../services/permission"
import { useAppTheme } from "../../theme"
import { NavigationParamProps, RouteParamProps } from "../../types"
import { GalleryHeader } from "./Header"
import { getImageItemSize, HORIZONTAL_COLUMN_COUNT, ImageItem, VERTICAL_COLUMN_COUNT } from "./ImageItem"
import { LoadingIndicator } from "./LoadingIndicator"


// TODO move the loading of images to a hook
// TODO optimize performance of ImageItem when in selection mode
export function Gallery() {


    const navigation = useNavigation<NavigationParamProps<"Gallery">>()
    const { params } = useRoute<RouteParamProps<"Gallery">>()

    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    const { color } = useAppTheme()

    const { documentDataState, dispatchDocumentData } = useDocumentData()

    const gallerySelection = useSelectionMode<string>()
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [imageGallery, setImageGallery] = useState<PhotoIdentifier[] | null>(null)
    const currentAmountOfImages = useMemo(() => imageGallery?.length ?? 0, [imageGallery])
    const [isGalleryFullLoaded, setIsGalleryFullLoaded] = useState(false)

    const columnCount = useMemo(() => (windowWidth < windowHeight)
        ? VERTICAL_COLUMN_COUNT
        : HORIZONTAL_COLUMN_COUNT
    , [windowWidth, windowHeight])
    const estimatedItemSize = useMemo(() => getImageItemSize(windowWidth, columnCount), [windowWidth, columnCount])

    const minimumRowAmountInScreen = useMemo(() => Math.ceil(
        (windowHeight - HEADER_HEIGHT) / estimatedItemSize
    ), [windowHeight, estimatedItemSize])
    const amountOfImageToLoadPerTime = useMemo(() => (
        (minimumRowAmountInScreen + 1) * columnCount
    ), [minimumRowAmountInScreen, columnCount])


    useBackHandler(() => {
        goBack()
        return true
    })


    async function getImage(refreshing?: boolean) {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        const hasReadMediaImagesPermission = await getReadMediaImagesPermission()
        if (!hasReadMediaImagesPermission) {
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
        if (gallerySelection.isSelectionMode) {
            gallerySelection.exitSelection()
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
        const hasReadMediaImagesPermission = await getReadMediaImagesPermission()
        if (!hasReadMediaImagesPermission) {
            log.warn("No permission to import image")
            Alert.alert(
                translate("warn"),
                translate("Gallery_alert_noPermissionToImportSingle_text")
            )
            return
        }

        const newImagePath = await DocumentService.getPicturePath(imagePath)
        const newImageName = DocumentService.getFileFullname(newImagePath)
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
        const hasReadMediaImagesPermission = await getReadMediaImagesPermission()
        if (!hasReadMediaImagesPermission) {
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

        for (let i = 0; i < gallerySelection.selectedData.length; i++) {
            const newImagePath = await DocumentService.getPicturePath(gallerySelection.selectedData[i])
            const newImageName = DocumentService.getFileFullname(newImagePath)

            imagesToCopy.push(gallerySelection.selectedData[i].replace("file://", ""))
            imagesToCopy.push(newImagePath)

            imagesToImport.push({
                id: undefined,
                filePath: newImagePath,
                fileName: newImageName,
                position: nextIndex
            } as DocumentPicture)

            nextIndex += 1
        }

        DocumentService.copyPicturesService(imagesToCopy)
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

    function renderItem({ item }: { item: PhotoIdentifier }) {
        return (
            <ImageItem
                onClick={() => importSingleImage(item.node.image.uri)}
                onSelect={() => gallerySelection.selectItem(item.node.image.uri)}
                onDeselect={() => gallerySelection.deselectItem(item.node.image.uri)}
                isSelectionMode={gallerySelection.isSelectionMode}
                isSelected={gallerySelection.selectedData.includes(item.node.image.uri)}
                imagePath={item.node.image.uri}
                screenAction={params?.screenAction}
                columnCount={columnCount}
            />
        )
    }

    const keyExtractor = useCallback((_: PhotoIdentifier, index: number) => index.toString(), [])

    async function onEndReached() {
        if (isGalleryFullLoaded) {
            return
        }

        const galleryLength = imageGallery?.length ?? 0
        const currentRowAmount = (galleryLength / columnCount)
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
        gallerySelection.exitSelection()
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
                exitSelectionMode={gallerySelection.exitSelection}
                importImage={importMultipleImage}
                isSelectionMode={gallerySelection.isSelectionMode}
                selectedImagesAmount={gallerySelection.selectedData.length}
            />

            <View style={{
                flex: 1,
                flexDirection: "row",
                display: imageGallery?.length ? "flex" : "none",
            }}>
                <FlashList
                    data={imageGallery}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    extraData={[gallerySelection.isSelectionMode]}
                    estimatedItemSize={estimatedItemSize}
                    numColumns={columnCount}
                    onEndReachedThreshold={0.05}
                    onEndReached={onEndReached}
                    ListFooterComponent={ListFooterComponent}
                    onRefresh={imageGallery?.length ? onRefresh : undefined}
                    refreshing={isRefreshing}
                />
            </View>

            <EmptyList visible={!imageGallery && !isRefreshing}>
                <ActivityIndicator
                    color={color.onBackground}
                    size={"large"}
                />
            </EmptyList>

            <EmptyList
                iconName={"images-outline"}
                iconGroup={"ionicons"}
                iconSize={56}
                message={translate("Gallery_emptyGallery")}
                visible={imageGallery?.length === 0}
            />
        </Screen>
    )
}

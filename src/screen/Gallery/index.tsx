import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, useWindowDimensions } from "react-native"
import CameraRoll, { PhotoIdentifier } from "@react-native-community/cameraroll"
import { useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"

import { EmptyList, SafeScreen } from "../../components"
import { useBackHandler } from "../../hooks"
import { copyPicturesService } from "../../services/document-service"
import { getDocumentPicturePath, useDocumentData } from "../../services/document"
import { log } from "../../services/log"
import { getWritePermission } from "../../services/permission"
import { useColorTheme } from "../../services/theme"
import { DocumentPicture, NavigationParamProps, RouteParamProps } from "../../types"
import { GalleryHeader } from "./Header"
import { ImageItem } from "./ImageItem"
import { LoadingIndicator } from "./LoadingIndicator"


export function Gallery() {


    const navigation = useNavigation<NavigationParamProps<"Gallery">>()
    const { params } = useRoute<RouteParamProps<"Gallery">>()

    const { width } = useWindowDimensions()

    const { color, opacity } = useColorTheme()

    const { documentDataState, dispatchDocumentData } = useDocumentData()
    const [imageGallery, setImageGallery] = useState<Array<PhotoIdentifier> | null>(null)
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Array<string>>([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    async function getImage() {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        const hasWritePermission = await getWritePermission()
        if (!hasWritePermission) {
            setImageGallery([])
            setIsLoading(false)
            log.warn("Gallery getImage - Não tem permissão pra usar a CameraRoll")
            Alert.alert(
                "Erro",
                "Sem permissão para abrir galeria"
            )
            return
        }

        try {
            const cameraRollPhotos = await CameraRoll.getPhotos({
                first: imageGallery ? imageGallery.length + 15 : 15,
                assetType: "Photos",
            })
            setImageGallery(cameraRollPhotos.edges)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            log.error(`Gallery getImage - Erro ao pegar imagens da CameraRoll. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao abrir galeria"
            )
        }
    }

    function goBack() {
        if (selectionMode) {
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
            log.warn("Sem permissão para importar uma imagem")
            Alert.alert(
                "Erro",
                "Sem permissão para importar imagem"
            )
            return
        }

        const newImagePath = await getDocumentPicturePath(imagePath)
        try {
            await RNFS.copyFile(imagePath, newImagePath)
        } catch (error) {
            log.error(`Gallery importSingleImage - Erro ao importar uma imagem da galeria. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao importar imagem da galeria"
            )
            return
        }

        if (params?.screenAction === "replace-picture") {
            dispatchDocumentData({
                type: "replace-picture",
                payload: {
                    indexToReplace: params.replaceIndex,
                    newPicture: newImagePath
                }
            })

            navigation.navigate("VisualizePicture", {
                pictureIndex: params.replaceIndex,
            })
            return
        }

        dispatchDocumentData({
            type: "add-picture",
            payload: [{
                id: undefined,
                filepath: newImagePath,
                position: documentDataState?.pictureList.length || 0
            }]
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
            log.warn("Sem permissão para importar múltiplas imagens")
            Alert.alert(
                "Erro",
                "Sem permissão para importar múltiplas imagens"
            )
            return
        }

        const imagesToCopy: string[] = []
        const imagesToImport: DocumentPicture[] = []
        let nextIndex = documentDataState?.pictureList.length ?? 0

        for (let i = 0; i < selectedImage.length; i++) {
            const newImagePath = await getDocumentPicturePath(selectedImage[i])

            imagesToCopy.push(selectedImage[i])
            imagesToCopy.push(newImagePath)

            imagesToImport.push({
                id: undefined,
                filepath: newImagePath,
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
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (!selectedImage.includes(imagePath)) {
            selectedImage.push(imagePath)
        }
    }

    function deselectImage(imagePath: string) {
        const index = selectedImage.indexOf(imagePath)
        if (index !== -1) {
            selectedImage.splice(index, 1)
        }
        if (selectionMode && selectedImage.length === 0) {
            setSelectionMode(false)
        }
    }

    function exitSelectionMode() {
        setSelectedImage([])
        setSelectionMode(false)
    }

    function renderItem({ item }: { item: PhotoIdentifier }) {
        return (
            <ImageItem
                click={() => importSingleImage(item.node.image.uri)}
                select={() => selectImage(item.node.image.uri)}
                deselect={() => deselectImage(item.node.image.uri)}
                selectionMode={selectionMode}
                imagePath={item.node.image.uri}
                screenAction={params?.screenAction}
            />
        )
    }

    const keyExtractor = useCallback((_: PhotoIdentifier, index: number) => {
        return index.toString()
    }, [])

    const getItemLayout = useCallback((_: PhotoIdentifier[] | null | undefined, index: number) => {
        return {
            length: (width / 3),
            offset: (width / 3) * index,
            index: index,
        }
    }, [width])


    useEffect(() => {
        getImage()
    }, [])


    return (
        <SafeScreen>
            <GalleryHeader
                goBack={goBack}
                exitSelectionMode={exitSelectionMode}
                importImage={importMultipleImage}
                selectionMode={selectionMode}
            />

            <FlatList
                data={imageGallery}
                renderItem={renderItem}
                extraData={[width, importSingleImage, selectImage, deselectImage, selectionMode]}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                numColumns={3}
                onEndReachedThreshold={0.05}
                onEndReached={getImage}
                ListFooterComponent={() => (isLoading && imageGallery) ? <LoadingIndicator /> : null}
                onRefresh={async () => {
                    setIsRefreshing(true)
                    setImageGallery(null)
                    await getImage()
                    setIsRefreshing(false)
                }}
                refreshing={isRefreshing}
            />

            {!imageGallery && (
                <EmptyList>
                    <ActivityIndicator
                        color={color.screen_color}
                        size={"large"}
                        style={{ opacity: opacity.mediumEmphasis }}
                    />
                </EmptyList>
            )}

            {imageGallery?.length === 0 && (
                <EmptyList
                    imageSource={require("../../image/empty_gallery.png")}
                    message={"Galeria vazia"}
                />
            )}
        </SafeScreen>
    )
}

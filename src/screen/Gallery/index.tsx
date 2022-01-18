import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/core"
import CameraRoll, { PhotoIdentifier } from "@react-native-community/cameraroll"
import RNFS from "react-native-fs"

import { GalleryHeader } from "./Header"
import { EmptyList, ImageItem, SafeScreen } from "../../components"
import { fullPathPicture } from "../../services/constant"
import { useBackHandler } from "../../hooks"
import { log } from "../../services/log"
import { getWritePermission } from "../../services/permission"
import { useColorTheme } from "../../services/theme"
import { DocumentPicture, NavigationParamProps, RouteParamProps } from "../../types"
import { useDocumentData } from "../../services/document"
import { LoadingIndicator } from "./LoadingIndicator"


export function Gallery() {


    const navigation = useNavigation<NavigationParamProps<"Gallery">>()
    const { params } = useRoute<RouteParamProps<"Gallery">>()

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

    async function getNewImagePath(imagePath: string) {
        // Get file in path
        const splitedImagePath = imagePath.split("/")
        const fileImage = splitedImagePath[splitedImagePath.length - 1]
        const splittedFileImage = fileImage.split(".")
        // Get file name
        let fileName = ""
        splittedFileImage.forEach((item: string, index: number) => {
            if (index !== splittedFileImage.length - 1) {
                fileName += item
            }
        })
        // Get file extension
        const fileExtension = splittedFileImage[splittedFileImage.length - 1]

        let counter = 0
        let newFileName = `${fullPathPicture}/${fileName}.${fileExtension}`
        while (await RNFS.exists(newFileName)) {
            newFileName = `${fullPathPicture}/${fileName} - ${counter}.${fileExtension}`
            counter += 1
        }
        return newFileName
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

        const newImagePath = await getNewImagePath(imagePath)
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

        const newImages: DocumentPicture[] = []
        let firstIndex = documentDataState?.pictureList.length || 0
        for (let x = 0; x < selectedImage.length; x++) {
            const newImagePath = await getNewImagePath(selectedImage[x])
            try {
                await RNFS.copyFile(selectedImage[x], newImagePath)
                newImages.push({
                    id: undefined,
                    filepath: newImagePath,
                    position: firstIndex
                })
                firstIndex += 1
            } catch (error) {
                log.error(`Gallery importMultipleImage - Erro ao importar multiplas imagens da galeria. Mensagem: "${error}"`)

                for (let i = 0; i < newImages.length; i++) {
                    try {
                        await RNFS.unlink(newImages[i].filepath)
                    } catch (error) {
                        log.warn("Gallery importMultipleImage - Erro ao apagar imagens copiadas da galeria para o app após erro ao importar múltiplas imagens")
                    }
                }

                Alert.alert(
                    "Erro",
                    "Erro deconhecido ao importar múltiplas imagens da galeria"
                )
                navigation.reset({
                    routes: [
                        { name: "Home" },
                        { name: "Camera" }
                    ]
                })
                return
            }
        }

        dispatchDocumentData({
            type: "add-picture",
            payload: newImages
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

    function renderImageItem({ item }: { item: PhotoIdentifier }) {
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

    function exitSelectionMode() {
        setSelectedImage([])
        setSelectionMode(false)
    }


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
                renderItem={renderImageItem}
                numColumns={3}
                onEndReachedThreshold={0.2}
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
                    source={require("../../image/empty_gallery.png")}
                    message={"Galeria vazia"}
                />
            )}
        </SafeScreen>
    )
}

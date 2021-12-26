import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import CameraRoll, { PhotoIdentifier } from "@react-native-community/cameraroll"
import RNFS from "react-native-fs"

import { ImportImageFromGaleryHeader } from "./Header"
import { EmptyList, ImageItem, SafeScreen } from "../../component"
import { fullPathPicture } from "../../service/constant"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { getWritePermission } from "../../service/permission"
import { ScreenParams } from "../../service/screen-params"
import { useTheme } from "../../service/theme"


export function ImportImageFromGalery() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ScreenParams, "ImportImageFromGalery">>()

    const { color, opacity } = useTheme()

    const [imageGalery, setImageGalery] = useState<Array<PhotoIdentifier> | null>(null)
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Array<string>>([])
    const [isRefreshingList, setIsRefreshingList] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    async function getImage() {
        const hasWritePermission = await getWritePermission()
        if (!hasWritePermission) {
            setImageGalery([])
            log("INFO", "ImportImageFromGalery getImage - Não tem permissão pra usar a CameraRoll")
            Alert.alert(
                "Erro",
                "Sem permissão para abrir galeria"
            )
            return
        }

        try {
            const cameraRollPhotos = await CameraRoll.getPhotos({
                first: imageGalery ? imageGalery.length + 15 : 15,
                assetType: "Photos",
            })
            setImageGalery(cameraRollPhotos.edges)
        } catch (error) {
            log("ERROR", `ImportImageFromGalery getImage - Erro ao pegar imagens da CameraRoll. Mensagem: "${error}"`)
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

        if (params.screenAction === "replace-picture") {
            navigation.reset({
                routes: [
                    { name: "Home" },
                    {
                        name: "EditDocument",
                        params: {
                            document: params.document,
                            documentName: params.documentName,
                            pictureList: params.pictureList,
                        }
                    },
                    {
                        name: "VisualizePicture",
                        params: {
                            pictureIndex: params.replaceIndex,
                            document: params.document,
                            documentName: params.documentName,
                            pictureList: params.pictureList,
                            isChanged: false,
                        }
                    },
                    {
                        name: "Camera",
                        params: {
                            document: params?.document,
                            documentName: params?.documentName,
                            pictureList: params.pictureList,
                            screenAction: params?.screenAction,
                            replaceIndex: params?.replaceIndex,
                        }
                    }
                ]
            })
            return
        }

        navigation.reset({
            routes: [
                { name: "Home" },
                {
                    name: "Camera",
                    params: {
                        document: params.document,
                        documentName: params.documentName,
                        pictureList: params.pictureList,
                    }
                }
            ]
        })
    }

    function selectImage(imagePath: string) {
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (selectedImage.indexOf(imagePath) === -1) {
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
                screenAction={params.screenAction}
            />
        )
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
            log("ERROR", `ImportImageFromGalery importSingleImage - Erro ao importar uma imagem da galeria. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao importar imagem da galeria"
            )
            navigation.reset({
                routes: [
                    { name: "Home" },
                    {
                        name: "Camera",
                        params: {
                            document: params.document,
                            documentName: params.documentName,
                            pictureList: params.pictureList,
                        }
                    }
                ]
            })
            return
        }

        if (!params?.screenAction) {
            navigation.reset({
                routes: [
                    { name: "Home" },
                    {
                        name: "Camera",
                        params: {
                            document: params.document,
                            pictureList: [...params.pictureList, newImagePath],
                            documentName: params.documentName,
                        }
                    }
                ]
            })
        } else if (params?.screenAction === "replace-picture" && params?.replaceIndex !== undefined) {
            params.pictureList[params.replaceIndex] = newImagePath

            navigation.navigate("VisualizePicture", {
                pictureIndex: params.replaceIndex,
                document: params.document,
                documentName: params.documentName,
                pictureList: params.pictureList,
                isChanged: true,
            })
        }
    }

    async function importMultipleImage() {
        const hasWritePermission = await getWritePermission()
        if (!hasWritePermission) {
            Alert.alert(
                "Erro",
                "Sem permissão para importar múltiplas imagens"
            )
            return
        }

        const newImages = []
        for (let x = 0; x < selectedImage.length; x++) {
            const newImagePath = await getNewImagePath(selectedImage[x])
            try {
                await RNFS.copyFile(selectedImage[x], newImagePath)
                newImages.push(newImagePath)
            } catch (error) {
                log("ERROR", `ImportImageFromGalery importMultipleImage - Erro ao importar multiplas imagens da galeria. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro",
                    "Erro deconhecido ao importar múltiplas imagens da galeria"
                )
                navigation.reset({
                    routes: [
                        { name: "Home" },
                        {
                            name: "Camera",
                            params: {
                                document: params.document,
                                documentName: params.documentName,
                                pictureList: params.pictureList,
                            }
                        }
                    ]
                })
                return
            }
        }

        navigation.reset({
            routes: [
                { name: "Home" },
                {
                    name: "Camera",
                    params: {
                        document: params.document,
                        documentName: params.documentName,
                        pictureList: [...params.pictureList, ...newImages],
                    }
                }
            ]
        })
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
            <ImportImageFromGaleryHeader
                goBack={goBack}
                exitSelectionMode={exitSelectionMode}
                importImage={importMultipleImage}
                selectionMode={selectionMode}
            />

            <FlatList
                data={imageGalery}
                renderItem={renderImageItem}
                keyExtractor={(_item, index) => index.toString()}
                extraData={[selectImage, deselectImage]}
                numColumns={3}
                onEndReachedThreshold={0.5}
                onEndReached={getImage}
                onRefresh={async () => {
                    setImageGalery(null)
                    await getImage()
                    setIsRefreshingList(false)
                }}
                refreshing={isRefreshingList}
            />

            {imageGalery === null && (
                <EmptyList>
                    <ActivityIndicator
                        color={color.screen_color}
                        size={"large"}
                        style={{
                            opacity: opacity.mediumEmphasis
                        }}
                    />
                </EmptyList>
            )}

            {imageGalery?.length === 0 && (
                <EmptyList
                    source={require("../../image/empty_gallery.png")}
                    message={"Galeria vazia"}
                />
            )}
        </SafeScreen>
    )
}

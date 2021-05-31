import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import CameraRoll, { PhotoIdentifier } from "@react-native-community/cameraroll"
import RNFS from "react-native-fs"

import { SafeScreen } from "../../component/Screen"
import { ImportImageFromGaleryHeader } from "./Header"
import { ImageItem } from "../../component/ImageItem"
import { EmptyListImage, EmptyListText, EmptyListView } from "../../component/EmptyList"
import { fullPathPicture } from "../../service/constant"
import { useTheme } from "../../service/theme"
import { useBackHandler } from "../../service/hook"
import { getCameraRollPermission } from "../../service/permission"
import { log } from "../../service/log"
import { ScreenParams } from "../../service/screen-params"


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


    const getImage = useCallback(async () => {
        const hasCameraRollPermission = await getCameraRollPermission()
        if (!hasCameraRollPermission) {
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
                "Não foi possível carregar galeria"
            )
        }
    }, [imageGalery])

    const goBack = useCallback(() => {
        if (selectionMode) {
            exitSelectionMode()
            return
        }

        if (params.screenAction === "replace-picture") {
            navigation.reset({routes: [
                {name: "Home"},
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
                        picturePath: params.picturePath,
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
                        picturePath: params.picturePath,
                    }
                }
            ]})
            return
        }

        navigation.reset({routes: [
            {name: "Home"},
            {
                name: "Camera",
                params: {
                    document: params.document,
                    documentName: params.documentName,
                    pictureList: params.pictureList,
                }
            }
        ]})
    }, [params, selectionMode])

    const selectImage = useCallback((imagePath: string) => {
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (selectedImage.indexOf(imagePath) === -1) {
            selectedImage.push(imagePath)
        }
    }, [selectionMode, selectedImage])

    const deselectImage = useCallback((imagePath: string) => {
        const index = selectedImage.indexOf(imagePath)
        if (index !== -1) {
            selectedImage.splice(index, 1)
        }
        if (selectionMode && selectedImage.length === 0) {
            setSelectionMode(false)
        }
    }, [selectedImage, selectionMode])

    const renderImageItem = useCallback(({ item }: { item: PhotoIdentifier }) => {
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
    }, [params, selectionMode, selectImage, deselectImage])

    const getNewImagePath = useCallback(async (imagePath: string) => {
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
    }, [])

    const importSingleImage = useCallback(async (imagePath: string) => {
        const newImagePath = await getNewImagePath(imagePath)
        try {
            await RNFS.copyFile(imagePath, newImagePath)
        } catch (error) {
            log("ERROR", `ImportImageFromGalery importSingleImage - Erro ao importar uma imagem da galeria. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Não foi possível importar imagem da galeria"
            )
            navigation.reset({routes: [
                {name: "Home"},
                {
                    name: "Camera",
                    params: {
                        document: params.document,
                        documentName: params.documentName,
                        pictureList: params.pictureList,
                    }
                }
            ]})
            return
        }

        if (!params?.screenAction) {
            navigation.reset({routes: [
                {name: "Home"},
                {
                    name: "Camera",
                    params: {
                        document: params.document,
                        pictureList: [...params.pictureList, newImagePath],
                        documentName: params.documentName,
                    }
                }
            ]})
        } else if (params?.screenAction === "replace-picture" && params?.replaceIndex !== undefined) {
            params.pictureList[params.replaceIndex] = newImagePath

            navigation.navigate("VisualizePicture", {
                picturePath: newImagePath,
                pictureIndex: params.replaceIndex,
                document: params.document,
                documentName: params.documentName,
                pictureList: params.pictureList,
                isChanged: true,
            })
        }
    }, [params])

    const importMultipleImage = useCallback(() => {
        const imagesToImport: Array<string> = [...params.pictureList]

        selectedImage.forEach(async (item: string) => {
            const newImagePath = await getNewImagePath(item)
            try {
                await RNFS.copyFile(item, newImagePath)
                imagesToImport.push(newImagePath)
            } catch (error) {
                log("ERROR", `ImportImageFromGalery importMultipleImage - Erro ao importar multiplas imagens da galeria. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro",
                    "Não foi possível importar multiplas imagens da galeria"
                )
                navigation.reset({routes: [
                    {name: "Home"},
                    {
                        name: "Camera",
                        params: {
                            document: params.document,
                            documentName: params.documentName,
                            pictureList: params.pictureList,
                        }
                    }
                ]})
                return
            }
        })

        navigation.reset({routes: [
            {name: "Home"},
            {
                name: "Camera",
                params: {
                    document: params.document,
                    documentName: params.documentName,
                    pictureList: imagesToImport,
                }
            }
        ]})
    }, [params, selectedImage])

    const exitSelectionMode = useCallback(() => {
        setSelectedImage([])
        setSelectionMode(false)
    }, [])


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
                <EmptyListView>
                    <ActivityIndicator
                        color={color.screen_color}
                        size={"large"}
                        style={{
                            opacity: opacity.mediumEmphasis
                        }}
                    />
                </EmptyListView>
            )}

            {imageGalery?.length === 0 && (
                <EmptyListView>
                    <EmptyListImage source={require("../../image/app/empty_gallery.png")} />

                    <EmptyListText>
                        Galeria vazia
                    </EmptyListText>
                </EmptyListView>
            )}
        </SafeScreen>
    )
}

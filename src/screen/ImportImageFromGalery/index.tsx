import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import CameraRoll, { PhotoIdentifier } from "@react-native-community/cameraroll"
import RNFS from "react-native-fs"

import { SafeScreen } from "../../component/Screen"
import ImportImageFromGaleryHeader from "./Header"
import { ImageItem } from "../../component/ImageItem"
import { Document } from "../../service/object-types"
import { EmptyListImage, EmptyListText, EmptyListView } from "../../component/EmptyList"
import { fullPathPictureOriginal } from "../../service/constant"
import { useTheme } from "../../service/theme"
import { useBackHandler } from "../../service/hook"
import { getCameraRollPermission } from "../../service/permission"
import { log } from "../../service/log"


type ImportImageFromGaleryParam = {
    ImportImageFromGalery: {
        document: Document | undefined,
        documentName: string | null,
        pictureList: Array<string>,
    }
}


export default function ImportImageFromGalery() {

    
    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ImportImageFromGaleryParam, "ImportImageFromGalery">>()

    const { color } = useTheme()

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
                "Falha em abrir galeria",
                "Permissão negada. Não foi possível abrir a galeria."
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
                "Erro ao carregar galeria",
                "Não foi possível carregar galeria"
            )
        }
    }, [imageGalery])

    const goBack = useCallback(() => {
        if (selectionMode) {
            exitSelectionMode()
            return
        }

        navigation.navigate("Camera", {
            document: params.document,
            documentName: params.documentName,
            pictureList: params.pictureList,
        })
    }, [selectionMode])

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

    const renderImageItem = useCallback(({ item }: {item: PhotoIdentifier}) => {
        return (
            <ImageItem
                click={() => importSingleImage(item.node.image.uri)}
                select={() => selectImage(item.node.image.uri)}
                deselect={() => deselectImage(item.node.image.uri)}
                selectionMode={selectionMode}
                imagePath={item.node.image.uri}
            />
        )
    }, [selectionMode, selectImage, deselectImage])

    const getNewImagePath = useCallback((imagePath: string) => {
        const splitedImagePath = imagePath.split("/")
        const newImageName = splitedImagePath[splitedImagePath.length - 1]
        return `${fullPathPictureOriginal}/${newImageName}`
    }, [])

    const importSingleImage = useCallback(async (imagePath: string) => {
        const newImagePath = getNewImagePath(imagePath)
        try {
            await RNFS.copyFile(imagePath, newImagePath)
        } catch (error) {
            log("ERROR", `ImportImageFromGalery importSingleImage - Erro ao importar uma imagem da galeria. Mensagem: "${error}"`)
            Alert.alert(
                "Erro ao importar imagem", 
                "Não foi possível importar uma imagem da galeria"
            )
            navigation.navigate("Camera", {
                document: params.document,
                pictureList: params.pictureList,
                documentName: params.documentName,
            })
            return
        }

        navigation.navigate("Camera", {
            document: params.document,
            pictureList: [...params.pictureList, newImagePath],
            documentName: params.documentName,
        })
    }, [])

    const importMultipleImage = useCallback(() => {
        const imagesToImport: Array<string> = [...params.pictureList]

        selectedImage.forEach(async (item: string) =>{ 
            const newImagePath = getNewImagePath(item)
            try {
                await RNFS.copyFile(item, newImagePath)
            } catch (error) {
                log("ERROR", `ImportImageFromGalery importMultipleImage - Erro ao importar multiplas imagens da galeria. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro ao importar imagens",
                    "Não foi possível importar multiplas imagens da galeria"
                )
            }
            imagesToImport.push(newImagePath)
        })

        navigation.navigate("Camera", {
            document: params.document,
            documentName: params.documentName,
            pictureList: imagesToImport,
        })
    }, [selectedImage])

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
                keyExtractor={(item, index) => index.toString()}
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
                    <ActivityIndicator color={color.color} size={"large"} />
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

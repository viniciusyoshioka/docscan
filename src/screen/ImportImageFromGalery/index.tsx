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


type ImportImageFromGaleryParam = {
    ImportImageFromGalery: {
        pictureList: Array<string>,
        documentName: string,
        documentObject: Document,
    }
}


export default function ImportImageFromGalery() {


    const { color } = useTheme()
    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ImportImageFromGaleryParam, "ImportImageFromGalery">>()

    const [imageGalery, setImageGalery] = useState<Array<PhotoIdentifier> | null>(null)
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Array<string>>([])


    useBackHandler(() => {
        goBack()
        return true
    })


    const getImage = useCallback(async () => {
        const hasCameraRollPermission = await getCameraRollPermission()
        if (!hasCameraRollPermission) {
            setImageGalery([])
            Alert.alert(
                "Falha em abrir galeria",
                "Permissão negada. Não foi possível abrir a galeria."
            )
            return
        }

        CameraRoll.getPhotos({
            first: imageGalery ? imageGalery.length + 15 : 15,
            assetType: "Photos",
        })
            .then((item) => {
                setImageGalery(item.edges)
            })
            .catch(() => {})
    }, [imageGalery])

    const goBack = useCallback(() => {
        if (selectionMode) {
            exitSelectionMode()
            return
        }

        navigation.navigate("Camera", {
            newPictureList: params.pictureList,
            newDocumentName: params.documentName,
            documentObject: params.documentObject,
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

    const importSingleImage = useCallback((imagePath: string) => {
        const splitedImagePath = imagePath.split("/")
        const newImageName = splitedImagePath[splitedImagePath.length - 1]
        const newImagePath = `${fullPathPictureOriginal}/${newImageName}`

        RNFS.copyFile(imagePath, newImagePath)
            .catch(() => {})

        navigation.navigate("Camera", {
            newPictureList: [...params.pictureList, newImagePath],
            newDocumentName: params.documentName,
            documentObject: params.documentObject,
        })
    }, [])

    const importMultipleImage = useCallback(() => {
        const imagesToImport: Array<string> = []

        params.pictureList.forEach((item: string) => {
            imagesToImport.push(item)
        })

        selectedImage.forEach((item: string) =>{ 
            const splitedImagePath = item.split("/")
            const newImageName = splitedImagePath[splitedImagePath.length - 1]
            const newImagePath = `${fullPathPictureOriginal}/${newImageName}`
            RNFS.copyFile(item, newImagePath)
                .catch(() => {})
            imagesToImport.push(newImagePath)
        })

        navigation.navigate("Camera", {
            newPictureList: imagesToImport,
            newDocumentName: params.documentName,
            documentObject: params.documentObject,
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
                onEndReached={() => getImage()}
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

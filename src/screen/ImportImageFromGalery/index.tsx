import React, { useCallback, useEffect, useState } from "react"
import { FlatList } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import CameraRoll, { PhotoIdentifier } from "@react-native-community/cameraroll"
import { useBackHandler } from "@react-native-community/hooks"

import { SafeScreen } from "../../component/Screen"
import ImportImageFromGaleryHeader from "./Header"
import { ImageItem } from "../../component/ImageItem"
import { Document } from "../../service/object-types"


type ImportImageFromGaleryParam = {
    ImportImageFromGalery: {
        pictureList: Array<string>,
        documentName: string,
        documentObject: Document,
    }
}


export default function ImportImageFromGalery() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ImportImageFromGaleryParam, "ImportImageFromGalery">>()

    const [imageGalery, setImageGalery] = useState<Array<PhotoIdentifier>>([])
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedImage, setSelectedImage] = useState<Array<string>>([])


    useBackHandler(() => {
        goBack()
        return true
    })


    const getImage = useCallback(() => {
        CameraRoll.getPhotos({first: imageGalery.length + 15})
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

    const deselectDocument = useCallback((imagePath: string) => {
        const index = selectedImage.indexOf(imagePath)
        if (index !== -1) {
            selectedImage.splice(index, 1)
        }
        if (selectionMode && selectedImage.length === 0) {
            setSelectionMode(false)
        }
    }, [selectedImage, selectionMode])

    const exitSelectionMode = useCallback(() => {
        setSelectedImage([])
        setSelectionMode(false)
    }, [])

    const importSingleImage = useCallback((imagePath: string) => {
        navigation.navigate("Camera", {
            newPictureList: [...params.pictureList, imagePath],
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
            imagesToImport.push(item)
        })
        navigation.navigate("Camera", {
            newPictureList: imagesToImport,
            newDocumentName: params.documentName,
            documentObject: params.documentObject,
        })
    }, [selectedImage])


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
                renderItem={({ item }) => (
                    <ImageItem
                        click={() => importSingleImage(item.node.image.uri)}
                        select={() => selectImage(item.node.image.uri)}
                        deselect={() => deselectDocument(item.node.image.uri)}
                        selectionMode={selectionMode}
                        imagePath={item.node.image.uri}
                    />
                )}
                onEndReached={() => {
                    getImage()
                }}
                onEndReachedThreshold={0.4}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeScreen>
    )
}

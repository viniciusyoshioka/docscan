import React, { useEffect, useState } from "react"
import { Alert, FlatList } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"

import { EditDocumentHeader } from "./Header"
import { RenameDocument } from "./RenameDocument"
import { PictureItem, SafeScreen } from "../../component"
import { ConvertPdfOption } from "./ConvertPdfOption"
import { NavigationParamProps, RouteParamProps, SimpleDocument } from "../../types"
import { useDocumentData } from "../../service/document"
import { useBackHandler } from "../../service/hook"
import { DocumentPicture } from "../../types"
import { DocumentDatabase } from "../../database"


export function EditDocument() {


    const navigation = useNavigation<NavigationParamProps<"EditDocument">>()
    const { params } = useRoute<RouteParamProps<"EditDocument">>()

    const [documentDataState, dispatchDocumentData] = useDocumentData()
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedPictureIndex, setSelectedPictureIndex] = useState<Array<number>>([])
    const [renameDocumentVisible, setRenameDocumentVisible] = useState(false)
    const [convertPdfOptionVisible, setConvertPdfOptionVisible] = useState(false)


    useBackHandler(() => {
        if (renameDocumentVisible) {
            setRenameDocumentVisible(false)
            return true
        }

        goBack()
        return true
    })


    function goBack() {
        if (selectionMode) {
            exitSelectionMode()
            return
        }

        dispatchDocumentData({ type: "save-document" })
        dispatchDocumentData({ type: "close-document" })
        navigation.reset({ routes: [{ name: "Home" }] })
    }

    function convertDocumentToPdf() { }

    function shareDocument() { }

    function visualizePdf() { }

    function renameDocument(newDocumentName: string) {
        dispatchDocumentData({
            type: "rename-document",
            payload: newDocumentName
        })

        dispatchDocumentData({ type: "save-document" })
    }

    function deletePdf() { }

    function deleteCurrentDocument() { }

    function openCamera() {
        navigation.navigate("Camera")
    }

    async function deleteSelectedPicture() {
        // TODO reorder position property of pictureList
        // TODO set new picture list in document data
        if (!documentDataState) {
            return
        }

        for (let i = 0; i < selectedPictureIndex.length; i++) {
            await RNFS.unlink(documentDataState.pictureList[i].filepath)
        }
        await DocumentDatabase.deleteDocumentPicture(selectedPictureIndex)
        dispatchDocumentData({ type: "save-document" })
        exitSelectionMode()
    }

    function alertDeletePicture() {
        Alert.alert(
            "Apagar foto",
            "Esta foto será apagada permanentemente",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Apagar", onPress: async () => await deleteSelectedPicture() }
            ]
        )
    }

    function selectPicture(pictureIndex: number) {
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (!selectedPictureIndex.includes(pictureIndex)) {
            selectedPictureIndex.push(pictureIndex)
        }
    }

    function deselectPicture(pictureIndex: number) {
        const index = selectedPictureIndex.indexOf(pictureIndex)
        if (index !== -1) {
            selectedPictureIndex.splice(index, 1)
        }
        if (selectionMode && selectedPictureIndex.length === 0) {
            setSelectionMode(false)
        }
    }

    function openPicture(pictureIndex: number) {
        navigation.navigate("VisualizePicture", {
            pictureIndex: pictureIndex
        })
    }

    function renderItem({ item, index }: { item: DocumentPicture, index: number }) {
        return (
            <PictureItem
                picturePath={item.filepath}
                click={() => openPicture(index)}
                select={() => selectPicture(index)}
                deselect={() => deselectPicture(index)}
                selectionMode={selectionMode}
            />
        )
    }

    function exitSelectionMode() {
        setSelectedPictureIndex([])
        setSelectionMode(false)
    }


    useEffect(() => {
        if (params?.documentId) {
            DocumentDatabase.getDocument(params.documentId)
                .then(async (document: SimpleDocument) => {
                    const documentPicture = await DocumentDatabase.getDocumentPicture(params.documentId)

                    dispatchDocumentData({
                        type: "set-document",
                        payload: {
                            document: {
                                id: params.documentId,
                                name: document.name,
                                lastModificationTimestamp: document.lastModificationTimestamp,
                            },
                            pictureList: documentPicture,
                        }
                    })
                })
        }
    }, [])


    return (
        <SafeScreen>
            <EditDocumentHeader
                goBack={goBack}
                exitSelectionMode={exitSelectionMode}
                documentName={documentDataState?.name || ""}
                selectionMode={selectionMode}
                deletePicture={alertDeletePicture}
                openCamera={openCamera}
                convertToPdf={() => setConvertPdfOptionVisible(true)}
                shareDocument={shareDocument}
                visualizePdf={visualizePdf}
                renameDocument={() => setRenameDocumentVisible(true)}
                deletePdf={deletePdf}
                deleteDocument={deleteCurrentDocument}
            />

            <FlatList
                data={documentDataState?.pictureList}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={{ padding: 4 }}
            />

            <RenameDocument
                visible={renameDocumentVisible}
                setVisible={setRenameDocumentVisible}
                documentName={documentDataState?.name || ""}
                setDocumentName={renameDocument}
            />

            <ConvertPdfOption
                visible={convertPdfOptionVisible}
                setVisible={setConvertPdfOptionVisible}
                convertToPdf={convertDocumentToPdf}
            />
        </SafeScreen>
    )
}

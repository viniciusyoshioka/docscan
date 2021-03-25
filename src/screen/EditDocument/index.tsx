import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList, ToastAndroid } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import { MenuProvider } from "react-native-popup-menu"
import { useBackHandler } from "@react-native-community/hooks"

import { SafeScreen } from "../../component/Screen"
import EditDocumentHeader from "./Header"
import PictureItem from "../../component/Pictureitem"
import { Document } from "../../service/object-types"
import { deleteDocument, saveEditedDocument, saveNewDocument } from "../../service/document-handler"
import RenameDocument from "./RenameDocument"


type EditDocumentParams = {
    EditDocument: {
        document: Document,
        documentObject: Document,
        documentName: string,
        pictureList: Array<string>,
    }
}


export default function EditDocument() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<EditDocumentParams, "EditDocument">>()

    const [document, setDocument] = useState(params.document || params.documentObject)
    const [documentName, setDocumentName] = useState(document ? document.name : params.documentName)
    const [pictureList, setPictureList] = useState(document ? document.pictureList : params.pictureList)
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedPictures, setSelectedPictures] = useState<Array<string>>([])
    const [renameDocumentVisible, setRenameDocumentVisible] = useState(false)
    const [changed, setChanged] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    const goBack = useCallback(() => {
        if (selectionMode) {
            setSelectedPictures([])
            setSelectionMode(false)
            return
        }

        if (document === undefined) {
            navigation.navigate("Camera", {
                newPictureList: pictureList,
                newDocumentName: documentName,
                documentObject: undefined
            })
        } else {
            if (changed) {
                Alert.alert(
                    "Descartar alterações?",
                    "O documento foi alterado, sair agora irá descartar todas as alterações",
                    [
                        {
                            text: "Voltar",
                            onPress: () => navigation.navigate("Home")
                        },
                        {
                            text: "Cancelar",
                            onPress: () => {}
                        }
                    ]
                )
                return
            }
            navigation.navigate("Home")
        }
    }, [document, selectionMode, pictureList, changed, documentName])

    const selectPicture = useCallback((picturePath: string) => {
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (selectedPictures.indexOf(picturePath) === -1) {
            selectedPictures.push(picturePath)
        }
    }, [selectionMode, selectedPictures])

    const deselectPicture = useCallback((picturePath: string) => {
        const index = selectedPictures.indexOf(picturePath)
        if (index !== -1) {
            selectedPictures.splice(index, 1)
        }
        if (selectionMode && selectedPictures.length === 0) {
            setSelectionMode(false)
        }
    }, [selectedPictures, selectionMode])

    const openPicture = useCallback((picturePath: string) => {
        navigation.navigate("VisualizePicture", {
            picturePath: picturePath
        })
    }, [])

    const deletePicture = useCallback(() => {
        const pictures = pictureList.reverse()

        const newPicture: Array<string> = []
        pictures.forEach(async (item: string) => {
            if (selectedPictures.indexOf(item) === -1) {
                newPicture.push(item)
            } else {
                await RNFS.unlink(item)
            }
        })
        newPicture.reverse()

        setPictureList(newPicture)

        if (!changed) {
            setChanged(true)
        }
    }, [pictureList, selectedPictures, changed])

    const openCamera = useCallback(() => {
        navigation.navigate("Camera", {
            newPictureList: pictureList,
            newDocumentName: documentName,
            documentObject: document
        })
    }, [pictureList, documentName, document])

    const renameDocument = useCallback((newDocumentName) => {
        setDocumentName(newDocumentName)

        if (!changed) {
            setChanged(true)
        }
    }, [changed])

    const exportDocumentToPdf = useCallback(() => {
        ToastAndroid.show("Export document to PDF is not available yet", 10)
    }, [])
    
    const discardDocument = useCallback(() => {
        Alert.alert(
            "Apagar documento?",
            "Esta ação é irreversível e apagará todo o conteúdo. Deseja apagar?",
            [
                {
                    text: "Apagar",
                    onPress: async () => {
                        if (document === undefined) {
                            pictureList.forEach(async (item) => {
                                await RNFS.unlink(item)
                            })
    
                            navigation.navigate("Home")
                        } else {
                            await deleteDocument([document.id], true)
                            navigation.reset({routes: [{name: "Home"}]})
                        }
                    }
                },
                {
                    text: "Cancelar",
                    onPress: () => {}
                }
            ]
        )
    }, [document, pictureList])

    const saveNotExistingDocument = useCallback(async () => {
        if (pictureList.length === 0) {
            Alert.alert(
                "Não há fotos para salvar",
                "Não é possível salvar um documento vazio"
            )
            return
        }

        await saveNewDocument(documentName, pictureList)
        navigation.reset({routes: [{name: "Home"}]})
    }, [documentName, pictureList])

    const saveExistingDocument = useCallback(async () => {
        if (pictureList.length === 0) {
            Alert.alert(
                "Não há fotos para salvar",
                "Não é possível salvar um documento vazio. Descartar documento?",
                [
                    {
                        text: "Descartar",
                        onPress: () => discardDocument()
                    },
                    {
                        text: "Cancelar",
                        onPress: () => {}
                    }
                ]
            )
            return
        }

        await saveEditedDocument(document, documentName, pictureList)
        navigation.reset({routes: [{name: "Home"}]})
    }, [document, documentName, pictureList, discardDocument])

    const saveDocument = useCallback(async () => {
        if (document === undefined) {
            await saveNotExistingDocument()
        } else {
            await saveExistingDocument()
        }
    }, [document, saveNotExistingDocument, saveExistingDocument])


    useEffect(() => {
        if (selectionMode) {
            setSelectedPictures([])
            setSelectionMode(false)
        }
    }, [pictureList])

    useEffect(() => {
        if (params !== undefined) {
            const paramsKeys = Object.keys(params)

            if (paramsKeys.length === 4 && paramsKeys.indexOf("document") !== -1) {
                setDocumentName(params.documentName)
                setPictureList(params.pictureList)
                setDocument(params.documentObject)
    
                if (params.pictureList) {
                    if (pictureList.length !== params.pictureList.length) {
                        setChanged(true)
                    }
                }
            }
        }
    }, [params])


    return (
        <MenuProvider skipInstanceCheck>
            <SafeScreen>
                <RenameDocument
                    visible={renameDocumentVisible} 
                    setVisible={setRenameDocumentVisible} 
                    documentName={documentName} 
                    setDocumentName={renameDocument}
                />

                <EditDocumentHeader
                    goBack={goBack}
                    documentName={documentName}
                    selectionMode={selectionMode} 
                    changed={changed}
                    isNewDocument={document === undefined}
                    deletePicture={() => deletePicture()}
                    openCamera={() => openCamera()}
                    saveDocument={() => saveDocument()}
                    renameDocument={() => setRenameDocumentVisible(true)}
                    exportToPdf={() => exportDocumentToPdf()}
                    discardDocument={() => discardDocument()}
                />

                <FlatList 
                    numColumns={2}
                    data={pictureList} 
                    renderItem={({ item }) => (
                        <PictureItem 
                            picturePath={item}
                            click={() => openPicture(item)}
                            select={() => selectPicture(item)}
                            deselect={() => deselectPicture(item)}
                            selectionMode={selectionMode} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </SafeScreen>
        </MenuProvider>
    )
}

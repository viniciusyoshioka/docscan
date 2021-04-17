import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList, ToastAndroid } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import { MenuProvider } from "react-native-popup-menu"
import Share from "react-native-share"

import { SafeScreen } from "../../component/Screen"
import EditDocumentHeader from "./Header"
import { PictureItem } from "../../component/Pictureitem"
import { Document } from "../../service/object-types"
import { deleteDocument, saveEditedDocument, saveNewDocument } from "../../service/document-handler"
import RenameDocument from "./RenameDocument"
import { createPdf } from "../../service/pdf-handler"
import { fullPathPdf, pathPdf } from "../../service/constant"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { ExportResponse } from "../../service/pdf-creator"


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
    const [isChanged, setIsChanged] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    const goBack = useCallback(() => {
        if (selectionMode) {
            exitSelectionMode()
            return
        }

        if (document === undefined) {
            navigation.navigate("Camera", {
                newPictureList: pictureList,
                newDocumentName: documentName,
                documentObject: undefined
            })
        } else {
            if (isChanged) {
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
    }, [document, selectionMode, pictureList, isChanged, documentName])

    const exportDocumentToPdf = useCallback(() => {
        if (isChanged) {
            Alert.alert(
                "Alterações não salvas",
                "Salve as alterações antes de exportar o documento"
            )
            return
        }

        if (documentName === "") {
            Alert.alert(
                "Nome do documento vazio",
                "Não é possível exportar documento sem nome"
            )
            return
        }

        if (pictureList.length === 0) {
            Alert.alert(
                "Documento sem fotos",
                "Não é possível exportar documento sem fotos"
            )
            return
        }

        createPdf(pictureList, documentName)
            .then((response: ExportResponse) => {
                if (response.uri.includes(fullPathPdf)) {
                    ToastAndroid.show(`Documento exportado para "Memória Externa/${pathPdf}/${documentName}.pdf"`, 10)
                    return
                }
                ToastAndroid.show(`Documento exportado para "${response.uri}"`, 10)
            })
            .catch((error) => {
                log("ERROR", `EditDocument exportDocumentToPdf - Erro ao export documento para PDF. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro ao exportar documento",
                    "Não foi possível exportar documento para PDF"
                )
            })

        Alert.alert(
            "Aguarde", 
            "Exportar documento pode demorar alguns segundos"
        )
    }, [isChanged, documentName, pictureList])

    const shareDocument = useCallback(async () => {
        if (isChanged) {
            Alert.alert(
                "Alterações não salvas",
                "Salve as alterações antes de compartilhar o documento"
            )
            return
        }

        const documentPath = `file://${fullPathPdf}/${documentName}.pdf`
        if (!(await RNFS.exists(documentPath))) {
            Alert.alert(
                "Não foi possível compartilhar",
                "Exporte o documento para PDF antes de compartilhá-lo"
            )
            return
        }

        try {
            await Share.open({
                title: "Compartilhar documento",
                type: "pdf/application",
                url: documentPath,
                failOnCancel: false
            })
        } catch (error) {
            log("ERROR", `EditDocument shareDocument - Erro ao compartilhar documento. Mensagem: "${error}"`)
            Alert.alert(
                "Não foi possível compartilhar documento",
                "Erro desconhecido ao compartilhar documento"
            )
        }
    }, [isChanged, documentName])

    const renameDocument = useCallback((newDocumentName: string) => {
        setDocumentName(newDocumentName)

        if (!isChanged) {
            setIsChanged(true)
        }
    }, [isChanged])

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
                                try {
                                    await RNFS.unlink(item)
                                } catch (error) {
                                    log("ERROR", `EditDocument discardDocument - Erro ao apagar fotos do documento durante seu descarte. Mensagem: "${error}"`)
                                    Alert.alert(
                                        "Erro ao descartar documento",
                                        "Erro ao apagar fotos do documento durante seu descarte"
                                    )
                                }
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

    const openCamera = useCallback(() => {
        navigation.navigate("Camera", {
            newPictureList: pictureList,
            newDocumentName: documentName,
            documentObject: document
        })
    }, [pictureList, documentName, document])

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

    const deletePicture = useCallback(() => {
        Alert.alert(
            "Apagar foto?",
            "Esta ação é irreversível e apagará a foto deste documento",
            [
                {
                    text: "Apagar", 
                    onPress: () => {
                        const pictures = pictureList.reverse()

                        const newPicture: Array<string> = []
                        pictures.forEach(async (item: string) => {
                            if (selectedPictures.indexOf(item) === -1) {
                                newPicture.push(item)
                            } else {
                                try {
                                    await RNFS.unlink(item)
                                } catch (error) {
                                    log("ERROR", `EditDocument deletePicture - Erro ao apagar foto do documento. Mensagem: "${error}"`)
                                    Alert.alert(
                                        "Erro ao apagar foto",
                                        "Não foi possível apagar foto do documento"
                                    )
                                }
                            }
                        })
                        newPicture.reverse()
                
                        setPictureList(newPicture)
                
                        if (!isChanged) {
                            setIsChanged(true)
                        }
                    }
                },
                {
                    text: "Cancelar", 
                    onPress: () => {}
                }
            ]
        )
    }, [pictureList, selectedPictures, isChanged])

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

    const openPicture = useCallback((item: string, index: number) => {
        navigation.navigate("VisualizePicture", {
            picturePath: item,
            pictureIndex: index,
            documentName: documentName,
            pictureList: pictureList,
            documentObject: document
        })
    }, [documentName, pictureList, document])

    const renderPictureItem = useCallback(({ item, index }: {item: string, index: number}) => {
        return (
            <PictureItem 
                picturePath={item}
                click={() => openPicture(item, index)}
                select={() => selectPicture(item)}
                deselect={() => deselectPicture(item)}
                selectionMode={selectionMode}
            />
        )
    }, [selectionMode, selectPicture, deselectPicture])

    const exitSelectionMode = useCallback(() => {
        setSelectedPictures([])
        setSelectionMode(false)
    }, [])


    useEffect(() => {
        if (selectionMode) {
            exitSelectionMode()
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
                        setIsChanged(true)
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
                    exitSelectionMode={exitSelectionMode}
                    documentName={documentName}
                    selectionMode={selectionMode} 
                    changed={isChanged}
                    isNewDocument={document === undefined}
                    deletePicture={deletePicture}
                    openCamera={openCamera}
                    saveDocument={saveDocument}
                    renameDocument={() => setRenameDocumentVisible(true)}
                    exportToPdf={exportDocumentToPdf}
                    discardDocument={discardDocument}
                    shareDocument={shareDocument}
                />

                <FlatList 
                    data={pictureList} 
                    renderItem={renderPictureItem}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                />
            </SafeScreen>
        </MenuProvider>
    )
}

import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList, ToastAndroid } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { SafeScreen } from "../../component/Screen"
import { EditDocumentHeader } from "./Header"
import { PictureItem } from "../../component/Pictureitem"
import { deleteDocument, saveEditedDocument, saveNewDocument } from "../../service/document-handler"
import { RenameDocument } from "./RenameDocument"
import { createPdf } from "../../service/pdf-creator"
import { fullPathPdf, pathPdf } from "../../service/constant"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { ExportResponse } from "../../service/pdf-creator"
import { ScreenParams } from "../../service/screen-params"


export function EditDocument() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ScreenParams, "EditDocument">>()

    const [documentName, setDocumentName] = useState<string>(params.document ? params.document.name : params.documentName ? params.documentName : "Nome do Documento")
    const [pictureList, setPictureList] = useState<Array<string>>(params.document ? params.document.pictureList : params.pictureList ? params.pictureList : [])

    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedPictures, setSelectedPictures] = useState<Array<string>>([])
    const [renameDocumentVisible, setRenameDocumentVisible] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    const saveDocument = useCallback(async (): Promise<boolean> => {
        // Return true to navigate to Home, false otherwise
        if (params.document) {
            if (documentName === "") {
                Alert.alert(
                    "Nome do documento vazio",
                    "Não é possível salvar um documento sem nome"
                )
                return false
            }
            await saveEditedDocument(params.document, documentName, pictureList)
            return true
        } else {
            if (pictureList.length === 0) {
                return true
            } else if (documentName === "") {
                Alert.alert(
                    "Nome do documento vazio",
                    "Não é possível salvar um documento sem nome"
                )
                return false
            }
            await saveNewDocument(documentName, pictureList)
            return true
        }
    }, [documentName, pictureList])

    const goBack = useCallback(async () => {
        if (selectionMode) {
            exitSelectionMode()
            return
        }

        const isSaved = await saveDocument()
        if (isSaved) {
            navigation.reset({routes: [{name: "Home"}]})
        }
    }, [selectionMode, saveDocument])

    const exportDocumentToPdf = useCallback(() => {
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
    }, [documentName, pictureList])

    const shareDocument = useCallback(async () => {
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
    }, [documentName])

    const renameDocument = useCallback(async (newDocumentName: string) => {
        setDocumentName(newDocumentName)

        await saveDocument()
    }, [saveDocument])

    const discardDocument = useCallback(() => {
        Alert.alert(
            "Apagar documento?",
            "Esta ação é irreversível e apagará todo o conteúdo. Deseja apagar?",
            [
                {
                    text: "Apagar",
                    onPress: async () => {
                        if (params.document) {
                            await deleteDocument([params.document.id], true)
                            navigation.reset({routes: [{name: "Home"}]})
                        } else {
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
                        }
                    }
                },
                {
                    text: "Cancelar",
                    onPress: () => {}
                }
            ]
        )
    }, [pictureList])

    const openCamera = useCallback(() => {
        navigation.navigate("Camera", {
            document: params.document,
            documentName: documentName,
            pictureList: pictureList,
        })
    }, [pictureList, documentName])

    const deletePicture = useCallback(() => {
        Alert.alert(
            "Apagar foto",
            "Esta foto será apagada e a ação não poderá ser desfeita",
            [
                {
                    text: "Apagar", 
                    onPress: async () => {
                        const pictures = pictureList.reverse()

                        const newPicture: Array<string> = []

                        pictures.forEach(async (item) => {
                            if (selectedPictures.includes(item)) {
                                try {
                                    await RNFS.unlink(item)
                                } catch (error) {
                                    log("ERROR", `EditDocument deletePicture - Erro ao apagar foto do documento. Mensagem: "${error}"`)
                                    Alert.alert(
                                        "Erro ao apagar foto",
                                        "Não foi possível apagar foto do documento"
                                    )
                                }
                            } else {
                                newPicture.push(item)
                            }
                        })

                        newPicture.reverse()

                        setPictureList(newPicture)

                        await saveDocument()
                    }
                },
                {
                    text: "Cancelar", 
                    onPress: () => {}
                }
            ]
        )
    }, [pictureList, selectedPictures, saveDocument])

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
            document: params.document
        })
    }, [documentName, pictureList])

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
    }, [selectionMode, selectPicture, deselectPicture, openPicture])

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
        if (params) {
            const paramKeys = Object.keys(params)

            if (paramKeys.length === 1 && params.document) {
                // setDocument(params.document)
                // setDocumentName(params.document.name)
                // setPictureList(params.document.pictureList)
            } else {
                // setDocument(params.document)
                // if (params.documentName) {
                //     setDocumentName(params.documentName)
                // }
                // if (params.pictureList) {
                //     setPictureList(params.pictureList)
                // }

                if (params.isChanged) {
                    saveDocument()
                }
            }
        }
    }, [params])


    return (
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
                deletePicture={deletePicture}
                openCamera={openCamera}
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
    )
}

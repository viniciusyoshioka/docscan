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
import { Document } from "../../service/object-types"


export function EditDocument() {


    const navigation = useNavigation()
    const { params } = useRoute<RouteProp<ScreenParams, "EditDocument">>()

    const [document, setDocument] = useState<Document | undefined>(params.document)
    const [documentName, setDocumentName] = useState<string>(
        (params.document)
            ? params.document.name
            : params.documentName
                ? params.documentName
                : "Nome do Documento")
    const [pictureList, setPictureList] = useState<Array<string>>(
        (params.document && !params.pictureList)
            ? params.document.pictureList
            : (params.pictureList)
                ? params.pictureList
                : []
    )

    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedPicturesIndex, setSelectedPicturesIndex] = useState<Array<number>>([])
    const [renameDocumentVisible, setRenameDocumentVisible] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    const saveDocument = useCallback(async (
        givenDocumentName: string | undefined = undefined,
        givenPictureList: Array<string> | undefined = undefined
    ) => {
        // Return true to navigate to Home, false otherwise

        const thisDocumentName: string = givenDocumentName || documentName
        const thisPictureList: Array<string> = givenPictureList || pictureList

        if (document) {
            if (thisDocumentName === "") {
                Alert.alert(
                    "Nome do documento vazio",
                    "Não é possível salvar um documento sem nome"
                )
                return
            }

            const savedDocument = await saveEditedDocument(document, thisDocumentName, thisPictureList)
            navigation.setParams({
                document: savedDocument,
                documentName: thisDocumentName,
                pictureList: thisPictureList,
                isChanged: undefined,
            })
        } else {
            if (thisPictureList.length === 0) {
                return
            } else if (thisDocumentName === "") {
                Alert.alert(
                    "Nome do documento vazio",
                    "Não é possível salvar um documento sem nome"
                )
                return
            }

            const savedDocument = await saveNewDocument(thisDocumentName, thisPictureList)
            navigation.setParams({
                document: savedDocument,
                documentName: thisDocumentName,
                pictureList: thisPictureList,
                isChanged: undefined,
            })
        }
    }, [document, documentName, pictureList])

    const goBack = useCallback(async () => {
        if (selectionMode) {
            exitSelectionMode()
            return
        }

        navigation.reset({routes: [{name: "Home"}]})
    }, [selectionMode])

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

        await saveDocument(newDocumentName, undefined)
    }, [saveDocument])

    const discardDocument = useCallback(() => {
        Alert.alert(
            "Apagar documento?",
            "Esta ação é irreversível e apagará todo o conteúdo. Deseja apagar?",
            [
                {
                    text: "Apagar",
                    onPress: async () => {
                        if (document) {
                            await deleteDocument([document.id], true)
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
    }, [document, pictureList])

    const openCamera = useCallback(() => {
        navigation.navigate("Camera", {
            document: document,
            documentName: documentName,
            pictureList: pictureList,
        })
    }, [document, pictureList, documentName])

    const deletePicture = useCallback(() => {
        Alert.alert(
            "Apagar foto",
            "Esta foto será apagada e a ação não poderá ser desfeita",
            [
                {
                    text: "Apagar", 
                    onPress: async () => {
                        const pictures = [...pictureList]

                        selectedPicturesIndex.sort((a, b) => b - a)
                        selectedPicturesIndex.forEach((item: number) => {
                            RNFS.unlink(pictures[item])
                                .catch((error) => {
                                    log("ERROR", `EditDocument deletePicture - Erro ao apagar foto do documento. Mensagem: "${error}"`)
                                })
                            pictures.splice(item, 1)
                        })

                        setPictureList(pictures)
                        saveDocument(undefined, pictures)
                        exitSelectionMode()
                    }
                },
                {
                    text: "Cancelar", 
                    onPress: () => {}
                }
            ]
        )
    }, [pictureList, selectedPicturesIndex, saveDocument])

    const selectPicture = useCallback((pictureIndex: number) => {
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (selectedPicturesIndex.indexOf(pictureIndex) === -1) {
            selectedPicturesIndex.push(pictureIndex)
        }
    }, [selectionMode, selectedPicturesIndex])

    const deselectPicture = useCallback((pictureIndex: number) => {
        const index = selectedPicturesIndex.indexOf(pictureIndex)
        if (index !== -1) {
            selectedPicturesIndex.splice(index, 1)
        }
        if (selectionMode && selectedPicturesIndex.length === 0) {
            setSelectionMode(false)
        }
    }, [selectedPicturesIndex, selectionMode])

    const openPicture = useCallback((item: string, index: number) => {
        navigation.navigate("VisualizePicture", {
            picturePath: item,
            pictureIndex: index,
            documentName: documentName,
            pictureList: pictureList,
            document: document
        })
    }, [document, documentName, pictureList])

    const renderPictureItem = useCallback(({ item, index }: {item: string, index: number}) => {
        return (
            <PictureItem 
                picturePath={item}
                click={() => openPicture(item, index)}
                select={() => selectPicture(index)}
                deselect={() => deselectPicture(index)}
                selectionMode={selectionMode}
            />
        )
    }, [selectionMode, selectPicture, deselectPicture, openPicture])

    const exitSelectionMode = useCallback(() => {
        setSelectedPicturesIndex([])
        setSelectionMode(false)
    }, [])


    useEffect(() => {
        if (params) {
            setDocument(params.document)

            setDocumentName(
                params.document
                    ? params.document.name
                    : params.documentName
                        ? params.documentName
                        : "Nome do Documento"
            )

            setPictureList(
                (params.document && !params.pictureList)
                    ? params.document.pictureList
                    : (params.pictureList)
                        ? params.pictureList
                        : []
            )

            if (params.isChanged) {
                saveDocument()
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
                keyExtractor={(_item, index) => index.toString()}
                extraData={[selectPicture, deselectPicture]}
                numColumns={2}
            />
        </SafeScreen>
    )
}

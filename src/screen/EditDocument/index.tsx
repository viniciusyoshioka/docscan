import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { SafeScreen } from "../../component/Screen"
import { EditDocumentHeader } from "./Header"
import { PictureItem } from "../../component/Pictureitem"
import { deleteDocument, saveEditedDocument, saveNewDocument } from "../../service/document-handler"
import { RenameDocument } from "./RenameDocument"
import { convertDocumentToPdf } from "../../service/pdf-creator"
import { openPdf } from "../../service/pdf-viewer"
import { fullPathPdf } from "../../service/constant"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
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
                : [])

    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedPicturesIndex, setSelectedPicturesIndex] = useState<Array<number>>([])
    const [renameDocumentVisible, setRenameDocumentVisible] = useState(false)


    useBackHandler(() => {
        if (renameDocumentVisible) {
            setRenameDocumentVisible(false)
            return true
        }

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
                    "Documento sem nome",
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
                    "Documento sem nome",
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

        navigation.reset({ routes: [{ name: "Home" }] })
    }, [selectionMode])

    const shareDocument = useCallback(async () => {
        const documentPath = `file://${fullPathPdf}/${documentName}.pdf`
        if (!(await RNFS.exists(documentPath))) {
            Alert.alert(
                "Aviso",
                "Converta o documento para PDF antes de compartilhá-lo"
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
                "Erro",
                "Erro desconhecido ao compartilhar o documento"
            )
        }
    }, [documentName])

    const visualizePdf = useCallback(async () => {
        const pdfFilePath = `${fullPathPdf}/${documentName}.pdf`

        if (!await RNFS.exists(pdfFilePath)) {
            log("WARN", "EditDocument visualizePdf - Arquivo PDF não existe para ser visualizado")
            Alert.alert(
                "Aviso",
                "Documento não existe em PDF. Converta o documento primeiro para visualizar"
            )
            return
        }

        openPdf(pdfFilePath)
    }, [documentName])

    const renameDocument = useCallback(async (newDocumentName: string) => {
        setDocumentName(newDocumentName)

        await saveDocument(newDocumentName, undefined)
    }, [saveDocument])

    const deleteCurrentDocument = useCallback(() => {
        async function alertDiscard() {
            if (document) {
                await deleteDocument([document.id], true)
                navigation.reset({ routes: [{ name: "Home" }] })
            } else {
                // This code may not been used
                // Delete document when not saved
                pictureList.forEach(async (item) => {
                    try {
                        await RNFS.unlink(item)
                    } catch (error) {
                        log("ERROR", `EditDocument discardDocument - Erro ao apagar fotos do documento durante seu descarte. Mensagem: "${error}"`)
                    }
                })

                navigation.navigate("Home")
            }
        }

        Alert.alert(
            "Apagar documento",
            "Este documento será apagado e todo seu conteúdo será perdido",
            [
                {text: "Cancelar", onPress: () => {}},
                {text: "Apagar", onPress: async () => await alertDiscard()}
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
        function alertDelete() {
            const pictures = [...pictureList]

            selectedPicturesIndex.sort((a, b) => b - a)
            selectedPicturesIndex.forEach(async (item: number) => {
                try {
                    await RNFS.unlink(pictures[item])
                } catch (error) {
                    log("ERROR", `EditDocument deletePicture - Erro ao apagar foto do documento. Mensagem: "${error}"`)
                }
                pictures.splice(item, 1)
            })

            setPictureList(pictures)
            saveDocument(undefined, pictures)
            exitSelectionMode()
        }

        Alert.alert(
            "Apagar foto",
            "Esta foto será apagada permanentemente",
            [
                {text: "Cancelar", onPress: () => {}},
                {text: "Apagar", onPress: () => alertDelete()}
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

    const renderPictureItem = useCallback(({ item, index }: { item: string, index: number }) => {
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
            const newDocumentName = params.document
                ? params.document.name
                : params.documentName
                    ? params.documentName
                    : "Nome do Documento"
            const newPictureList = (params.document && !params.pictureList)
                ? params.document.pictureList
                : (params.pictureList)
                    ? params.pictureList
                    : []

            setDocument(params.document)
            setDocumentName(newDocumentName)
            setPictureList(newPictureList)

            if (params.isChanged) {
                saveDocument(newDocumentName, newPictureList)
            }
        }
    }, [params])


    return (
        <SafeScreen>
            <EditDocumentHeader
                goBack={goBack}
                exitSelectionMode={exitSelectionMode}
                documentName={documentName}
                selectionMode={selectionMode}
                deletePicture={deletePicture}
                openCamera={openCamera}
                renameDocument={() => setRenameDocumentVisible(true)}
                convertToPdf={() => convertDocumentToPdf(documentName, pictureList)}
                deleteDocument={deleteCurrentDocument}
                shareDocument={shareDocument}
                visualizePdf={visualizePdf}
            />

            <FlatList
                data={pictureList}
                renderItem={renderPictureItem}
                keyExtractor={(_item, index) => index.toString()}
                extraData={[selectPicture, deselectPicture]}
                numColumns={2}
                style={{marginLeft: 6, marginTop: 6}}
            />

            <RenameDocument
                visible={renameDocumentVisible}
                setVisible={setRenameDocumentVisible}
                documentName={documentName}
                setDocumentName={renameDocument}
            />
        </SafeScreen>
    )
}

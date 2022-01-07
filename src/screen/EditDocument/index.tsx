import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList } from "react-native"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/core"
import RNFS from "react-native-fs"
import { createPdf, PdfCreatorOptions, viewPdf } from "react-native-pdf-creator"
import Share from "react-native-share"

import { PictureItem, SafeScreen } from "../../component"
import { DocumentDatabase } from "../../database"
import { fullPathPdf, fullPathTemporaryCompressedPicture } from "../../service/constant"
import { useDocumentData } from "../../service/document"
import { useBackHandler } from "../../service/hook"
import { log } from "../../service/log"
import { getReadPermission, getWritePermission } from "../../service/permission"
import { DocumentPicture, NavigationParamProps, RouteParamProps, SimpleDocument } from "../../types"
import { ConvertPdfOption } from "./ConvertPdfOption"
import { EditDocumentHeader } from "./Header"
import { RenameDocument } from "./RenameDocument"


export function EditDocument() {


    const navigation = useNavigation<NavigationParamProps<"EditDocument">>()
    const { params } = useRoute<RouteParamProps<"EditDocument">>()

    const [documentDataState, dispatchDocumentData] = useDocumentData()
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedPictureIndex, setSelectedPictureIndex] = useState<number[]>([])
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

        dispatchDocumentData({ type: "save-and-close-document" })
        navigation.reset({ routes: [{ name: "Home" }] })
    }

    async function convertDocumentToPdf(quality: number) {
        if (!documentDataState) {
            log.warn("documentDataState está vazio - verificação antes de converter para pdf")
            Alert.alert(
                "Aviso",
                "Não é possível converter documento para PDF, o documento está vazio"
            )
            return
        }

        if (documentDataState.name === "") {
            log.warn("Documento sem nome - Não é possível converter um documento sem nome para PDF")
            Alert.alert(
                "Documento sem nome",
                "Não é possível converter um documento sem nome para PDF"
            )
            return
        }

        if (documentDataState.pictureList.length === 0) {
            log.warn("Documento sem fotos - Não é possível converter um documento sem fotos para PDF")
            Alert.alert(
                "Documento sem fotos",
                "Não é possível converter um documento sem fotos para PDF"
            )
            return
        }

        const hasPermission = await getWritePermission()
        if (!hasPermission) {
            log.warn("Sem permissão para converter o documento em pdf")
            Alert.alert(
                "Erro",
                "Sem permissão para converter documento para PDF"
            )
            return
        }

        const documentPath = `${fullPathPdf}/${documentDataState.name}.pdf`
        if (await RNFS.exists(documentPath)) {
            try {
                await RNFS.unlink(documentPath)
            } catch (error) {
                log.error(`Erro ao apagar arquivo PDF já existente com mesmo nome do documento a ser convertido. "${error}"`)
            }
        }

        const pdfOptions: PdfCreatorOptions = {
            imageCompressQuality: quality,
            temporaryPath: fullPathTemporaryCompressedPicture,
        }

        const pictureList: string[] = []
        documentDataState.pictureList.forEach((item) => {
            pictureList.push(item.filepath)
        })

        createPdf(pictureList, documentPath, pdfOptions)
    }

    async function shareDocument() {
        if (!documentDataState) {
            log.warn("documentDataState está vazio - verificação antes de compartilhar pdf do documento")
            Alert.alert(
                "Aviso",
                "Não é possível compartilhar o PDF, o documento está vazio"
            )
            return
        }

        const documentPath = `file://${fullPathPdf}/${documentDataState.name}.pdf`
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
            log.error(`Erro ao compartilhar pdf do documento. "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao compartilhar PDF do documento"
            )
        }
    }

    async function visualizePdf() {
        if (!documentDataState) {
            log.warn("documentDataState está vazio - verificação antes de visualizar pdf do documento")
            Alert.alert(
                "Aviso",
                "Não é possível visualizar PDF, o documento está vazio"
            )
            return
        }

        const hasPermission = await getReadPermission()
        if (!hasPermission) {
            log.warn("Sem permissão READ_EXTERNAL_STORAGE para visualizar PDF")
            Alert.alert(
                "Erro",
                "Sem permissão para visualizar PDF"
            )
            return
        }

        const pdfFilePath = `${fullPathPdf}/${documentDataState.name}.pdf`
        if (!await RNFS.exists(pdfFilePath)) {
            log.warn("Arquivo PDF não existe para ser visualizado")
            Alert.alert(
                "Aviso",
                "Documento não existe em PDF. Converta o documento primeiro para visualizar"
            )
            return
        }

        viewPdf(pdfFilePath)
    }

    function renameDocument(newDocumentName: string) {
        dispatchDocumentData({
            type: "rename-document",
            payload: newDocumentName
        })
    }

    async function deletePdf() {
        if (!documentDataState) {
            log.warn("documentDataState está vazio - verificação antes de apagar pdf")
            Alert.alert(
                "Aviso",
                "Não é possível apagar PDF"
            )
            return
        }

        const hasPermission = await getWritePermission()
        if (!hasPermission) {
            log.warn("Sem permissão WRITE_EXTERNAL_STORAGE para apagar PDF")
            Alert.alert(
                "Erro",
                "Sem permissão para apagar PDF"
            )
            return
        }

        const pdfFilePath = `${fullPathPdf}/${documentDataState.name}.pdf`
        if (await RNFS.exists(pdfFilePath)) {
            try {
                await RNFS.unlink(pdfFilePath)
                Alert.alert(
                    "PDF apagado",
                    "Arquivo PDF do documento apagado com sucesso"
                )
            } catch (error) {
                log.error(`Erro ao apagar arquivo PDF do documento "${error}"`)
                Alert.alert(
                    "Erro",
                    "Erro desconhecido apagando PDF"
                )
            }
            return
        }

        Alert.alert(
            "Alerta",
            "Arquivo PDF do documento não existe"
        )
    }

    function alertDeletePdf() {
        Alert.alert(
            "Apagar PDF",
            "O PDF deste documento será apagado permanentemente",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Apagar", onPress: async () => await deletePdf() }
            ]
        )
    }

    async function deleteCurrentDocument() {
        if (documentDataState) {
            for (let i = 0; i < documentDataState.pictureList.length; i++) {
                try {
                    await RNFS.unlink(documentDataState.pictureList[i].filepath)
                } catch (error) {
                    log.warn("Erro apagando arquivos de imagem do documento ao apagar documento atual")
                }
            }
            if (documentDataState.id) {
                await DocumentDatabase.deleteDocument([documentDataState.id])
            }
            dispatchDocumentData({ type: "close-document" })
        }
        navigation.reset({ routes: [{ name: "Home" }] })
    }

    function alertDeleteCurrentDocument() {
        Alert.alert(
            "Apagar documento",
            "Este documento será apagado permanentemente",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Ok", onPress: async () => await deleteCurrentDocument() }
            ]
        )
    }

    async function deleteSelectedPicture() {
        if (!documentDataState) {
            return
        }

        const pictureIdToDelete: number[] = []
        for (let i = 0; i < selectedPictureIndex.length; i++) {
            try {
                const pictureId = documentDataState.pictureList[i].id
                if (pictureId) {
                    pictureIdToDelete.push(pictureId)
                }
                await RNFS.unlink(documentDataState.pictureList[i].filepath)
            } catch (error) {
                log.warn(`Erro apagando arquivo das imagens selecionadas do documento. "${error}"`)
            }
        }

        await DocumentDatabase.deleteDocumentPicture(pictureIdToDelete)
        dispatchDocumentData({
            type: "remove-picture",
            payload: selectedPictureIndex,
        })
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

    useFocusEffect(useCallback(() => {
        if (documentDataState?.hasChanges) {
            dispatchDocumentData({
                type: "save-document",
                payload: async (documentId: number) => {
                    const document = await DocumentDatabase.getDocument(documentId)
                    const documentPicture = await DocumentDatabase.getDocumentPicture(documentId)

                    dispatchDocumentData({
                        type: "set-document",
                        payload: {
                            document: {
                                id: documentId,
                                ...document,
                            },
                            pictureList: documentPicture
                        }
                    })
                }
            })
        }
    }, []))


    return (
        <SafeScreen>
            <EditDocumentHeader
                goBack={goBack}
                exitSelectionMode={exitSelectionMode}
                documentName={documentDataState?.name || ""}
                selectionMode={selectionMode}
                deletePicture={alertDeletePicture}
                openCamera={() => navigation.navigate("Camera")}
                convertToPdf={() => setConvertPdfOptionVisible(true)}
                shareDocument={shareDocument}
                visualizePdf={visualizePdf}
                renameDocument={() => setRenameDocumentVisible(true)}
                deletePdf={alertDeletePdf}
                deleteDocument={alertDeleteCurrentDocument}
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

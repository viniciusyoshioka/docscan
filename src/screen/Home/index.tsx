import { useNavigation } from "@react-navigation/core"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList } from "react-native"

import { EmptyList, Screen } from "../../components"
import { DocumentDatabase } from "../../database"
import { useBackHandler } from "../../hooks"
import { appIconOutline } from "../../services/constant"
import { deletePicturesService } from "../../services/document-service"
import { log } from "../../services/log"
import { DocumentForList, NavigationParamProps } from "../../types"
import { DocumentItem, DOCUMENT_PICTURE_HEIGHT } from "./DocumentItem"
import { HomeHeader } from "./Header"


export function Home() {


    const navigation = useNavigation<NavigationParamProps<"Home">>()

    const [documents, setDocuments] = useState<DocumentForList[]>([])
    const [isSelecionMode, setIsSelectionMode] = useState(false)
    const [selectedDocumentsId, setSelectedDocumentsIs] = useState<number[]>([])


    useBackHandler(() => {
        if (isSelecionMode) {
            exitSelectionMode()
            return true
        }
    })


    async function getDocumentList() {
        try {
            const documentList = await DocumentDatabase.getDocumentList()
            setDocuments(documentList)
        } catch (error) {
            log.error(`Error getting document list from database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro ao carregar documentos"
            )
        }
    }

    async function deleteSelectedDocument() {
        try {
            const picturesToDelete = await DocumentDatabase.getPicturePathFromDocument(selectedDocumentsId)
            await DocumentDatabase.deleteDocument(selectedDocumentsId)
            deletePicturesService(picturesToDelete)
            await getDocumentList()
            exitSelectionMode()
        } catch (error) {
            log.error(`Error deleting selected documents from database: "${error}"`)
            Alert.alert(
                "Aviso",
                "Erro ao apagar documentos selecionados"
            )
        }
    }

    function alertDeleteDocument() {
        Alert.alert(
            "Apagar",
            "Estes documentos serão apagados permanentemente",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Apagar", onPress: async () => await deleteSelectedDocument() }
            ]
        )
    }

    async function exportSelectedDocument() {
        DocumentDatabase.exportDocument(selectedDocumentsId)
        exitSelectionMode()
    }

    function alertExportDocument() {
        if (documents.length === 0) {
            Alert.alert(
                "Aviso",
                "Nenhum documento existente para ser exportado"
            )
            return
        }

        Alert.alert(
            "Exportar",
            `Os documentos ${isSelecionMode ? "selecionados " : ""}serão exportados`,
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Exportar", onPress: async () => await exportSelectedDocument() }
            ]
        )
    }

    // TODO
    async function mergeSelectedDocument() {
        exitSelectionMode()
    }

    function alertMergeDocument() {
        Alert.alert(
            "Unir",
            "Os documento selecionados serão unidos",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Unir", onPress: async () => await mergeSelectedDocument() }
            ]
        )
    }

    // TODO
    async function duplicateSelectedDocument() {
        exitSelectionMode()
    }

    function alertDuplicateDocument() {
        Alert.alert(
            "Duplicar",
            "Os documento selecionados serão duplicados",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Duplicar", onPress: async () => await duplicateSelectedDocument() }
            ]
        )
    }

    function selectDocument(documentId: number) {
        if (!isSelecionMode) {
            setIsSelectionMode(true)
        }
        if (!selectedDocumentsId.includes(documentId)) {
            setSelectedDocumentsIs(currentSelectedDocument => [...currentSelectedDocument, documentId])
        }
    }

    function deselectDocument(documentId: number) {
        const index = selectedDocumentsId.indexOf(documentId)
        if (index !== -1) {
            const newSelectedDocument = [...selectedDocumentsId]
            newSelectedDocument.splice(index, 1)
            setSelectedDocumentsIs(newSelectedDocument)

            if (isSelecionMode && newSelectedDocument.length === 0) {
                setIsSelectionMode(false)
            }
        }
    }

    function exitSelectionMode() {
        setSelectedDocumentsIs([])
        setIsSelectionMode(false)
    }

    function renderItem({ item }: { item: DocumentForList }) {
        return (
            <DocumentItem
                click={() => navigation.navigate("EditDocument", { documentId: item.id })}
                select={() => selectDocument(item.id)}
                deselect={() => deselectDocument(item.id)}
                selectionMode={isSelecionMode}
                document={item}
            />
        )
    }

    const keyExtractor = useCallback((item: DocumentForList, _) => {
        return item.id.toString()
    }, [])

    const getItemLayout = useCallback((_, index: number) => ({
        index: index,
        length: DOCUMENT_PICTURE_HEIGHT,
        offset: DOCUMENT_PICTURE_HEIGHT * index,
    }), [])

    const ListEmptyComponent = useCallback(() => {
        return (
            <EmptyList
                imageSource={appIconOutline}
                message={"Nenhum documento"}
            />
        )
    }, [])


    useEffect(() => {
        getDocumentList()
    }, [])


    return (
        <Screen>
            <HomeHeader
                selectionMode={isSelecionMode}
                exitSelectionMode={exitSelectionMode}
                deleteSelectedDocument={alertDeleteDocument}
                scanNewDocument={() => navigation.navigate("Camera")}
                importDocument={() => navigation.navigate("FileExplorer")}
                exportDocument={alertExportDocument}
                openSettings={() => navigation.navigate("Settings")}
                mergeDocument={alertMergeDocument}
                duplicateDocument={alertDuplicateDocument}
            />

            <FlatList
                data={documents}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ListEmptyComponent={ListEmptyComponent}
                contentContainerStyle={{
                    flex: 1,
                    paddingTop: documents.length ? 8 : 0,
                }}
            />
        </Screen>
    )
}

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

    const [document, setDocument] = useState<DocumentForList[]>([])
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<number[]>([])


    useBackHandler(() => {
        if (selectionMode) {
            exitSelectionMode()
            return true
        }
    })


    async function getDocumentList() {
        try {
            const documentList = await DocumentDatabase.getDocumentList()
            setDocument(documentList)
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
            const picturesToDelete = await DocumentDatabase.getPicturePathFromDocument(selectedDocument)
            await DocumentDatabase.deleteDocument(selectedDocument)
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
        DocumentDatabase.exportDocument(selectedDocument)
        exitSelectionMode()
    }

    function alertExportDocument() {
        if (document.length === 0) {
            Alert.alert(
                "Aviso",
                "Nenhum documento existente para ser exportado"
            )
            return
        }

        Alert.alert(
            "Exportar",
            `Os documentos ${selectionMode ? "selecionados " : ""}serão exportados`,
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
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (!selectedDocument.includes(documentId)) {
            setSelectedDocument(currentSelectedDocument => [...currentSelectedDocument, documentId])
        }
    }

    function deselectDocument(documentId: number) {
        const index = selectedDocument.indexOf(documentId)
        if (index !== -1) {
            const newSelectedDocument = [...selectedDocument]
            newSelectedDocument.splice(index, 1)
            setSelectedDocument(newSelectedDocument)

            if (selectionMode && newSelectedDocument.length === 0) {
                setSelectionMode(false)
            }
        }
    }

    function exitSelectionMode() {
        setSelectedDocument([])
        setSelectionMode(false)
    }

    function renderItem({ item }: { item: DocumentForList }) {
        return (
            <DocumentItem
                click={() => navigation.navigate("EditDocument", { documentId: item.id })}
                select={() => selectDocument(item.id)}
                deselect={() => deselectDocument(item.id)}
                selectionMode={selectionMode}
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
                selectionMode={selectionMode}
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
                data={document}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ListEmptyComponent={ListEmptyComponent}
                contentContainerStyle={{
                    flex: 1,
                    paddingTop: document.length ? 8 : 0,
                }}
            />
        </Screen>
    )
}

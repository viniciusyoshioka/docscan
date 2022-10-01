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
import { DocumentItem } from "./DocumentItem"
import { HomeHeader } from "./Header"


export function Home() {


    const navigation = useNavigation<NavigationParamProps<"Home">>()

    const [documents, setDocuments] = useState<DocumentForList[]>([])
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedDocumentsId, setSelectedDocumentsId] = useState<number[]>([])


    useBackHandler(() => {
        if (isSelectionMode) {
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

    function invertSelection() {
        setSelectedDocumentsId(current => documents
            .filter(documentItem => !current.includes(documentItem.id))
            .map(documentItem => documentItem.id)
        )
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

        const exportAlertText = isSelectionMode
            ? "Os documentos selecionados serão exportados"
            : "Todos os documentos serão exportados"

        Alert.alert(
            "Exportar",
            exportAlertText,
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
            "Os documento selecionados serão unidos em um único documento",
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
        if (!isSelectionMode) {
            setIsSelectionMode(true)
        }
        if (!selectedDocumentsId.includes(documentId)) {
            setSelectedDocumentsId(currentSelectedDocument => [...currentSelectedDocument, documentId])
        }
    }

    function deselectDocument(documentId: number) {
        const index = selectedDocumentsId.indexOf(documentId)
        if (index !== -1) {
            const newSelectedDocument = [...selectedDocumentsId]
            newSelectedDocument.splice(index, 1)
            setSelectedDocumentsId(newSelectedDocument)

            if (isSelectionMode && newSelectedDocument.length === 0) {
                setIsSelectionMode(false)
            }
        }
    }

    function exitSelectionMode() {
        setSelectedDocumentsId([])
        setIsSelectionMode(false)
    }

    function renderItem({ item }: { item: DocumentForList }) {
        return (
            <DocumentItem
                onClick={() => navigation.navigate("EditDocument", { documentId: item.id })}
                onSelected={() => selectDocument(item.id)}
                onDeselected={() => deselectDocument(item.id)}
                isSelectionMode={isSelectionMode}
                isSelected={selectedDocumentsId.includes(item.id)}
                document={item}
            />
        )
    }

    const keyExtractor = useCallback((item: DocumentForList) => item.id.toString(), [])


    useEffect(() => {
        getDocumentList()
    }, [])


    return (
        <Screen>
            <HomeHeader
                selectionMode={isSelectionMode}
                selectedDocumentsAmount={selectedDocumentsId.length}
                exitSelectionMode={exitSelectionMode}
                invertSelection={invertSelection}
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
                style={{ display: documents.length ? "flex" : "none" }}
                contentContainerStyle={{ paddingTop: documents.length ? 8 : 0 }}
            />

            <EmptyList
                imageSource={appIconOutline}
                message={"Nenhum documento"}
                visible={documents.length === 0}
            />
        </Screen>
    )
}

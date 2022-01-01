import React, { useEffect, useState } from "react"
import { Alert, BackHandler, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/core"

import { HomeHeader } from "./Header"
import { DocumentItem, EmptyList, SafeScreen } from "../../component"
import { appIconOutline } from "../../service/constant"
import { createAllFolder } from "../../service/folder-handler"
import { useBackHandler } from "../../service/hook"
import { DocumentForList } from "../../types"
import { DocumentDatabase } from "../../database"
import { NavigationParamProps } from "../../types"


export function Home() {


    const navigation = useNavigation<NavigationParamProps<"Home">>()

    const [document, setDocument] = useState<DocumentForList[]>([])
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<number[]>([])


    useBackHandler(() => {
        if (selectionMode) {
            exitSelectionMode()
        } else {
            BackHandler.exitApp()
        }
        return true
    })


    async function getDocumentList() {
        const documentList = await DocumentDatabase.getDocumentList()
        setDocument(documentList)
    }

    // TODO
    async function deleteSelectedDocument() {
        await DocumentDatabase.deleteDocument(selectedDocument)
        await getDocumentList()
        exitSelectionMode()
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

    // TODO
    async function exportSelectedDocument() {
        exitSelectionMode()
    }

    function alertExportDocument() {
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
            selectedDocument.push(documentId)
        }
    }

    function deselectDocument(documentId: number) {
        const index = selectedDocument.indexOf(documentId)
        if (index !== -1) {
            selectedDocument.splice(index, 1)
        }
        if (selectionMode && selectedDocument.length === 0) {
            setSelectionMode(false)
        }
    }

    function renderDocumentItem({ item }: { item: DocumentForList }) {
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

    function exitSelectionMode() {
        setSelectedDocument([])
        setSelectionMode(false)
    }


    useEffect(() => {
        createAllFolder()
        getDocumentList()
    }, [])


    return (
        <SafeScreen>
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
                renderItem={renderDocumentItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={[selectDocument, deselectDocument]}
                style={{ marginLeft: 6, marginTop: 6 }}
            />

            {document.length === 0 && (
                <EmptyList
                    source={appIconOutline}
                    message={"Nenhum documento"}
                />
            )}
        </SafeScreen>
    )
}

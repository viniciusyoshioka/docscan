import React, { useCallback, useEffect, useState } from "react"
import { Alert, BackHandler, FlatList, ToastAndroid } from "react-native"
import { useNavigation } from "@react-navigation/core"

import { HomeHeader } from "./Header"
import { DocumentItem, EmptyList, SafeScreen } from "../../component"
import { appIconOutline } from "../../service/constant"
import { deleteDocument, duplicateDocument, exportDocument, mergeDocument } from "../../service/document-handler"
import { createAllFolder } from "../../service/folder-handler"
import { useBackHandler } from "../../service/hook"
import { Document } from "../../service/object-types"
import { readDocument } from "../../service/storage"
import { getWritePermission } from "../../service/permission"
import { log } from "../../service/log"


export function Home() {


    const navigation = useNavigation()

    const [document, setDocument] = useState<Array<Document>>([])
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<Array<number>>([])


    useBackHandler(() => {
        if (selectionMode) {
            exitSelectionMode()
        } else {
            BackHandler.exitApp()
        }
        return true
    })


    const getDocument = useCallback(async () => {
        const documents = await readDocument()
        setDocument(documents)
    }, [])

    const deleteSelectedDocument = useCallback(() => {
        async function alertDelete() {
            await deleteDocument(selectedDocument, true)
            await getDocument()
            exitSelectionMode()
        }

        Alert.alert(
            "Apagar",
            "Estes documentos serão apagados permanentemente",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Apagar", onPress: async () => await alertDelete() }
            ]
        )
    }, [selectedDocument])

    const exportSelectedDocument = useCallback(() => {
        async function alertExport() {
            const hasPermission = await getWritePermission()
            if (hasPermission) {
                exportDocument(selectedDocument, selectionMode)
            } else {
                log("WARN", "Home exportSelectedDocument - Sem permissão para exportar documento")
                Alert.alert(
                    "Permissão negada",
                    "Sem permissão para exportar documentos"
                )
            }
            exitSelectionMode()
        }

        Alert.alert(
            "Exportar",
            `Os documentos ${selectionMode ? "selecionados " : ""}serão exportados`,
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Exportar", onPress: async () => await alertExport() }
            ]
        )
    }, [selectedDocument, selectionMode])

    const mergeSelectedDocument = useCallback(() => {
        mergeDocument(selectedDocument)
            .then(async () => {
                await getDocument()
                ToastAndroid.show("Documentos combinados", ToastAndroid.LONG)
            })
            .catch(() => { })
        exitSelectionMode()
    }, [selectedDocument])

    const duplicateSelectedDocument = useCallback(() => {
        duplicateDocument(selectedDocument)
            .then(async () => {
                await getDocument()
                ToastAndroid.show("Documentos duplicados", ToastAndroid.LONG)
            })
            .catch(() => { })
        exitSelectionMode()
    }, [selectedDocument])

    const selectDocument = useCallback((documentId: number) => {
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (selectedDocument.indexOf(documentId) === -1) {
            selectedDocument.push(documentId)
        }
    }, [selectionMode, selectedDocument])

    const deselectDocument = useCallback((documentId: number) => {
        const index = selectedDocument.indexOf(documentId)
        if (index !== -1) {
            selectedDocument.splice(index, 1)
        }
        if (selectionMode && selectedDocument.length === 0) {
            setSelectionMode(false)
        }
    }, [selectedDocument, selectionMode])

    const renderDocumentItem = useCallback(({ item }: { item: Document }) => {
        return (
            <DocumentItem
                click={() => navigation.navigate("EditDocument", { document: item })}
                select={() => selectDocument(item.id)}
                deselect={() => deselectDocument(item.id)}
                selectionMode={selectionMode}
                document={item}
            />
        )
    }, [selectionMode, selectDocument, deselectDocument])

    const exitSelectionMode = useCallback(() => {
        setSelectedDocument([])
        setSelectionMode(false)
    }, [])


    useEffect(() => {
        createAllFolder()
        getDocument()
    }, [])


    return (
        <SafeScreen>
            <HomeHeader
                selectionMode={selectionMode}
                exitSelectionMode={exitSelectionMode}
                deleteSelectedDocument={deleteSelectedDocument}
                scanNewDocument={() => navigation.navigate("Camera")}
                importDocument={() => navigation.navigate("FileExplorer")}
                exportDocument={exportSelectedDocument}
                openSettings={() => navigation.navigate("Settings")}
                mergeDocument={mergeSelectedDocument}
                duplicateDocument={duplicateSelectedDocument}
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

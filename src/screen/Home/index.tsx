import React, { useEffect, useState } from "react"
import { Alert, BackHandler, FlatList, ToastAndroid } from "react-native"
import { useNavigation } from "@react-navigation/core"

import { HomeHeader } from "./Header"
import { DocumentItem, EmptyList, SafeScreen } from "../../component"
import { appIconOutline } from "../../service/constant"
import { createAllFolder } from "../../service/folder-handler"
import { useBackHandler } from "../../service/hook"
import { getWritePermission } from "../../service/permission"
import { log } from "../../service/log"
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


    async function getDocument() {
        const documents = await DocumentDatabase.getDocumentList()
        setDocument(documents)
    }

    function deleteSelectedDocument() {
        async function alertDelete() {
            await DocumentDatabase.deleteDocument(selectedDocument)
            await DocumentDatabase.deleteDocumentPicture(selectedDocument)
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
    }

    function exportSelectedDocument() {
        async function alertExport() {
            const hasPermission = await getWritePermission()
            if (!hasPermission) {
                log.warn("Home exportSelectedDocument - Sem permissão para exportar documento")
                Alert.alert(
                    "Permissão negada",
                    "Sem permissão para exportar documentos"
                )
            }

            DocumentDatabase.exportDocument(selectedDocument)
                .then(() => {
                    ToastAndroid.show("Documentos exportados", ToastAndroid.LONG)
                })
                .catch((error) => {
                    log.error(`Erro ao exportar documentos: "${error}"`)
                })
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
    }

    function mergeSelectedDocument() {
        DocumentDatabase.mergeDocument(selectedDocument)
            .then(async () => {
                await getDocument()
                ToastAndroid.show("Documentos combinados", ToastAndroid.LONG)
            })
            .catch((error) => {
                log.error(`Erro unindo documentos: "${error}"`)
            })
        exitSelectionMode()
    }

    function duplicateSelectedDocument() {
        DocumentDatabase.duplicateDocument(selectedDocument)
            .then(async () => {
                await getDocument()
                ToastAndroid.show("Documentos duplicados", ToastAndroid.LONG)
            })
            .catch((error) => {
                log.error(`Erro duplicando documentos: "${error}"`)
            })
        exitSelectionMode()
    }

    function selectDocument(documentId: number) {
        if (!selectionMode) {
            setSelectionMode(true)
        }
        if (selectedDocument.indexOf(documentId) === -1) {
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

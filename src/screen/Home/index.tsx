import React, { useCallback, useEffect, useState } from "react"
import { Alert, BackHandler, FlatList } from "react-native"
import { EventArg, NavigationState, useNavigation } from "@react-navigation/core"
import RNFS from "react-native-fs"

import { DocumentItem } from "../../component/DocumentItem"
import { SafeScreen } from "../../component/Screen"
import { debugHome, Document } from "../../service/object-types"
import { readDebugHome, readDocument, readDocumentId, writeDebugHome, writeDocument, writeDocumentId } from "../../service/storage"
import { HomeHeader } from "./Header"
import { appIconOutline, appInDevelopment, fullPathPicture } from "../../service/constant"
import { deleteDocument, exportDocument } from "../../service/document-handler"
import { createAllFolder, createPictureFolder } from "../../service/folder-handler"
import { EmptyListImage, EmptyListText, EmptyListView } from "../../component/EmptyList"
import { useBackHandler } from "../../service/hook"
import { DebugHome } from "./DebugHome"


export function Home() {


    const navigation = useNavigation()

    const [debugHome, setDebugHome] = useState<debugHome>("show")
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


    const debugGetDebugHome = useCallback(async () => {
        if (appInDevelopment) {
            const getDebugHome = await readDebugHome()
            setDebugHome(getDebugHome)
        } else {
            setDebugHome("hide")
        }
    }, [])

    const debugSwitchDebugHome = useCallback(async () => {
        if (debugHome === "show") {
            setDebugHome("hide")
            await writeDebugHome("hide")
        } else if (debugHome === "hide") {
            setDebugHome("show")
            await writeDebugHome("show")
        }
    }, [debugHome])

    const debugReadDocument = useCallback(async () => {
        const documentList = await readDocument()
        const documentId = await readDocumentId()

        setDocument(documentList)

        console.log(`document - READ - ${JSON.stringify(documentList)}`)
        console.log(`documentId - READ - ${JSON.stringify(documentId)}`)
    }, [])

    const debugWriteDocument = useCallback(async () => {
        const tempDocumentList: Array<Document> = [
            { id: 0, name: "Titulo 1", lastModificationDate: "09:19 08/03/2021", pictureList: [] },
            { id: 1, name: "Titulo 2", lastModificationDate: "09:19 08/03/2021", pictureList: [] },
            { id: 2, name: "Titulo 3", lastModificationDate: "09:19 08/03/2021", pictureList: [] },
            { id: 3, name: "Titulo 4", lastModificationDate: "09:19 08/03/2021", pictureList: [] },
            { id: 4, name: "Titulo 5", lastModificationDate: "09:19 08/03/2021", pictureList: [] },
        ]
        const tempDocumentId: Array<number> = [0, 1, 2, 3, 4]

        await writeDocument(tempDocumentList)
        await writeDocumentId(tempDocumentId)

        setDocument(tempDocumentList)

        console.log("document, documentId - WRITTEN")
    }, [])

    const debugClearDocument = useCallback(async () => {
        await writeDocument([])
        await writeDocumentId([])

        await RNFS.unlink(fullPathPicture)
        await createPictureFolder()

        setDocument([])

        console.log("document, documentId, Picture - CLEAR")
    }, [])


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
                {text: "Cancelar", onPress: () => {}},
                {text: "Apagar", onPress: async () => await alertDelete()}
            ]
        )
    }, [selectedDocument])

    const exportSelectedDocument = useCallback(() => {
        function alertExport() {
            exportDocument(selectedDocument, selectionMode)
            exitSelectionMode()
        }

        Alert.alert(
            "Exportar",
            `Os documentos ${selectionMode ? "selecionados " : ""}serão exportados`,
            [
                {text: "Cancelar", onPress: () => {}},
                {text: "Exportar", onPress: () => alertExport()}
            ]
        )
    }, [selectedDocument, selectionMode])

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
        debugGetDebugHome()
        getDocument()
    }, [])

    useEffect(() => {
        type stateType = EventArg<
            "state", boolean | undefined, {state: NavigationState}
        >

        function printNavigationHistory(event: stateType) {
            let routes = "ROTAS: "
            event.data.state.routes.forEach((item) => {
                routes += `${item.name} `
            })
            console.log(routes)
        }

        navigation.addListener("state", printNavigationHistory)

        return () => navigation.removeListener("state", printNavigationHistory)
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
                switchDebugHome={debugSwitchDebugHome}
            />

            <FlatList
                data={document}
                renderItem={renderDocumentItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={[selectDocument, deselectDocument]}
                style={{marginLeft: 6, marginTop: 6}}
            />

            {document.length === 0 && (
                <EmptyListView>
                    <EmptyListImage source={appIconOutline} />

                    <EmptyListText>
                        Nenhum documento
                    </EmptyListText>
                </EmptyListView>
            )}

            {(debugHome === "show") && (
                <DebugHome
                    debugReadDocument={debugReadDocument}
                    debugWriteDocument={debugWriteDocument}
                    debugClearDocument={debugClearDocument}
                />
            )}
        </SafeScreen>
    )
}

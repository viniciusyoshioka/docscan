import React, { useCallback, useEffect, useState } from "react"
import { Alert, BackHandler, FlatList, View } from "react-native"
import { useNavigation } from "@react-navigation/core"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { DocumentItem } from "../../component/DocumentItem"
import { SafeScreen } from "../../component/Screen"
import { Document } from "../../service/object-types"
import { readDebugHome, readDocument, readDocumentId, writeDebugHome, writeDocument, writeDocumentId } from "../../service/storage"
import { HomeHeader } from "./Header"
import { DebugButton } from "../../component/DebugButton"
import { useSwitchTheme } from "../../service/theme"
import { appIconOutline, appInDevelopment, debugHomeHide, debugHomeShow, fullPathLog, fullPathRoot } from "../../service/constant"
import { deleteDocument } from "../../service/document-handler"
import { createAllFolder } from "../../service/folder-handler"
import { EmptyListImage, EmptyListText, EmptyListView } from "../../component/EmptyList"
import { useBackHandler } from "../../service/hook"


export function Home() {


    const navigation = useNavigation()

    const switchTheme = useSwitchTheme()

    const [debugHome, setDebugHome] = useState("")
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


    const debugReadDocument = useCallback(async () => {
        const documentList = await readDocument()
        const documentId = await readDocumentId()

        setDocument(documentList)

        console.log(`document - READ - ${JSON.stringify(documentList)}`)
        console.log(`documentId - READ - ${JSON.stringify(documentId)}`)
    }, [])

    const debugWriteDocument = useCallback(async () => {
        const tempDocumentList: Array<Document> = [
            {id: 0, name: "Titulo 1", lastModificationDate: "09:19 08/03/2021", pictureList: []},
            {id: 1, name: "Titulo 2", lastModificationDate: "09:19 08/03/2021", pictureList: []},
            {id: 2, name: "Titulo 3", lastModificationDate: "09:19 08/03/2021", pictureList: []},
            {id: 3, name: "Titulo 4", lastModificationDate: "09:19 08/03/2021", pictureList: []},
            {id: 4, name: "Titulo 5", lastModificationDate: "09:19 08/03/2021", pictureList: []},
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
        
        setDocument([])

        console.log("document, documentId - CLEAR")
    }, [])

    const debugGetDebugHome = useCallback(async () => {
        if (appInDevelopment) {
            const getDebugHome = await readDebugHome()
            setDebugHome(getDebugHome)
        } else {
            setDebugHome(debugHomeHide)
        }
    }, [])

    const debugSwitchDebugHome = useCallback(async () => {
        if (debugHome === debugHomeShow) {
            setDebugHome(debugHomeHide)
            await writeDebugHome(debugHomeHide)
        } else if (debugHome === debugHomeHide) {
            setDebugHome(debugHomeShow)
            await writeDebugHome(debugHomeShow)
        }
    }, [debugHome])

    const debugShareLog = useCallback(async () => {
        try {
            if (await RNFS.exists(fullPathLog)) {
                await Share.open({
                    title: "Compartilhar log",
                    type: "text/plain",
                    url: `file://${fullPathRoot}/docscanlog.log`,
                    failOnCancel: false
                })
                return
            }

            Alert.alert(
                "INFO",
                "Não há arquivo de log para compartilhar"
            )
        } catch (error) {
            console.log(`FALHA MODERADA - Erro ao compartilhar arquivo de log. Mensagem: "${error}"`)
            Alert.alert(
                "FALHA MODERADA",
                `Erro ao compartilhar arquivo de log. Mensagem: "${error}"`
            )
        }
    }, [])

    const debugReadLog = useCallback(async () => {
        try {
            if (await RNFS.exists(fullPathLog)) {
                const logContent = await RNFS.readFile(`${fullPathRoot}/docscanlog.log`)
                console.log(`Arquivo de Log: "${logContent}"`)
                return
            }

            Alert.alert(
                "INFO",
                "Não há arquivo de log para ler"
            )
        } catch (error) {
            console.log(`FALHA MODERADA - Erro ao ler arquivo de log. Mensagem: "${error}"`)
            Alert.alert(
                "FALHA MODERADA",
                `Erro ao ler arquivo de log. Mensagem: "${error}"`
            )
        }
    }, [])


    const getDocument = useCallback(async () => {
        const documents = await readDocument()
        setDocument(documents)
    }, [])

    const deleteSelectedDocument = useCallback(() => {
        Alert.alert(
            "Apagar documento?",
            "Esta ação não poderá ser desfeita. Deseja apagar?",
            [
                {
                    text: "Apagar", 
                    onPress: async () => {
                        await deleteDocument(selectedDocument, true)
                        await getDocument()
                        exitSelectionMode()
                    }
                },
                {
                    text: "Cancelar",
                    onPress: () => {}
                }
            ]
        )
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

    const renderDocumentItem = useCallback(({ item }: {item: Document}) => {
        return (
            <DocumentItem
                click={() => navigation.navigate("EditDocument", {document: item})}
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


    return (
        <SafeScreen>
            <HomeHeader
                selectionMode={selectionMode}
                exitSelectionMode={exitSelectionMode}
                deleteSelectedDocument={deleteSelectedDocument}
                scanNewDocument={() => navigation.navigate("Camera")}
                openSettings={() => navigation.navigate("Settings")}
                switchDebugHome={debugSwitchDebugHome}
            />

            <FlatList
                data={document}
                renderItem={renderDocumentItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={[selectDocument, deselectDocument]}
            />

            {document.length === 0 && (
                <EmptyListView>
                    <EmptyListImage source={appIconOutline} />

                    <EmptyListText>
                        Nenhum documento
                    </EmptyListText>
                </EmptyListView>
            )}

            {(debugHome === debugHomeShow) && (
                <View>
                    <DebugButton
                        text={"Ler"}
                        onPress={debugReadDocument}
                        style={{bottom: 115}} />
                    <DebugButton
                        text={"Escre"}
                        onPress={debugWriteDocument}
                        style={{bottom: 60}} />
                    <DebugButton
                        text={"Limpar"}
                        onPress={debugClearDocument}
                        style={{bottom: 5}} />

                    <DebugButton
                        text={"Auto"}
                        onPress={async () => await switchTheme("auto")}
                        style={{bottom: 115, left: 60}} />
                    <DebugButton
                        text={"Claro"}
                        onPress={async () => await switchTheme("light")}
                        style={{bottom: 60, left: 60}} />
                    <DebugButton
                        text={"Escuro"}
                        onPress={async () => await switchTheme("dark")}
                        style={{bottom: 5, left: 60}} />

                    <DebugButton
                        text={"Ler"}
                        onPress={debugReadLog}
                        style={{bottom: 60, left: 115}} />
                    <DebugButton
                        text={"Compar"}
                        onPress={debugShareLog}
                        style={{bottom: 5, left: 115}} />
                </View>
            )}
        </SafeScreen>
    )
}

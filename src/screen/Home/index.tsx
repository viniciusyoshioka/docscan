import React, { useCallback, useContext, useEffect, useState } from "react"
import { Alert, BackHandler, FlatList, View } from "react-native"
import { useNavigation } from "@react-navigation/core"
import { useBackHandler } from "@react-native-community/hooks"
import { MenuProvider } from "react-native-popup-menu"

import { DocumentItem } from "../../component/DocumentItem"
import { SafeScreen } from "../../component/Screen"
import { Document } from "../../service/object-types"
import { readDebugHome, readDocument, readDocumentId, writeDebugHome, writeDocument, writeDocumentId } from "../../service/storage"
import HomeHeader from "./Header"
import { DebugButton } from "../../component/DebugButton"
import { SwitchThemeContext } from "../../service/theme"
import { debugHomeHide, debugHomeShow, themeDark, themeLight } from "../../service/constant"
import { deleteDocument } from "../../service/document-handler"
import { createAllFolder } from "../../service/folder-handler"


export default function Home() {


    const switchTheme = useContext(SwitchThemeContext)

    const navigation = useNavigation()

    const [debugHome, setDebugHome] = useState("")
    const [document, setDocument] = useState<Array<Document>>([])
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<Array<number>>([])


    useBackHandler(() => {
        if (selectionMode) {
            setSelectedDocument([])
            setSelectionMode(false)
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
        const getDebugHome = await readDebugHome()
        setDebugHome(getDebugHome)
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


    const getDocument = useCallback(async () => {
        const readDocumentList = await readDocument()
        setDocument(readDocumentList)
    }, [])

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

    const deleteSelectedDocument = useCallback(() => {
        Alert.alert(
            "Apagar documento?",
            "Esta ação não poderá ser desfeita. Deseja apagar?",
            [
                {text: "Apagar", onPress: async () => {
                    await deleteDocument(selectedDocument, true)
                    await getDocument()
                }},
                {text: "Cancelar", onPress: () => {}}
            ],
            {cancelable: false}
        )
    }, [selectedDocument])


    useEffect(() => {
        createAllFolder()
        debugGetDebugHome()
        getDocument()
    }, [])

    useEffect(() => {
        if (selectionMode) {
            setSelectedDocument([])
            setSelectionMode(false)
        }
    }, [document])


    return (
        <MenuProvider>
            <SafeScreen>
                <HomeHeader
                    selectionMode={selectionMode}
                    deleteSelectedDocument={deleteSelectedDocument}
                    scanNewDocument={() => navigation.navigate("Camera")}
                    openSettings={() => navigation.navigate("Settings")}
                    switchDebugHome={debugSwitchDebugHome}
                />

                <FlatList
                    data={document}
                    renderItem={({ item }) => (
                        <DocumentItem
                            click={() => navigation.navigate("EditDocument", {document: item})}
                            select={() => selectDocument(item.id)}
                            deselect={() => deselectDocument(item.id)}
                            selectionMode={selectionMode}
                            document={item}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />

                {(debugHome === debugHomeShow) && (
                    <View>
                        <DebugButton 
                            text={"Ler"} 
                            onPress={async () => await debugReadDocument()} 
                            style={{bottom: 115}} />
                        <DebugButton 
                            text={"Escre"} 
                            onPress={async () => await debugWriteDocument()} 
                            style={{bottom: 60}} />
                        <DebugButton 
                            text={"Limpar"} 
                            onPress={async () => await debugClearDocument()} 
                            style={{bottom: 5}} />

                        <DebugButton 
                            text={"Claro"} 
                            onPress={async () => await switchTheme(themeLight)} 
                            style={{bottom: 60, left: 60}} />
                        <DebugButton 
                            text={"Escuro"} 
                            onPress={async () => await switchTheme(themeDark)} 
                            style={{bottom: 5, left: 60}} />
                    </View>
                )}
            </SafeScreen>
        </MenuProvider>
    )
}

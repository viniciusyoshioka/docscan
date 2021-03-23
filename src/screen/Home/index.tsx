import React, { useCallback, useEffect, useState } from "react"
import { BackHandler, FlatList, ToastAndroid } from "react-native"
import { useNavigation } from "@react-navigation/core"

import { DocumentItem } from "../../component/DocumentItem"
import { SafeScreen } from "../../component/Screen"
import { Document } from "../../service/object-types"
import { readDocument } from "../../service/storage"
import HomeHeader from "./Header"


export default function Home() {


    const navigation = useNavigation()

    const [document, setDocument] = useState<Array<Document>>([])
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<Array<number>>([])


    const getDocument = useCallback(async () => {
        const readDocumentList = await readDocument()
        setDocument(readDocumentList)
    }, [])

    const openDocument = useCallback((documentObject: Document) => {
        ToastAndroid.show("Open document is not available yet", 10)
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

    const setBackhandler = useCallback(() => {
        if (selectionMode) {
            setSelectedDocument([])
            setSelectionMode(false)
        } else {
            BackHandler.exitApp()
        }
        return true
    }, [selectionMode])


    useEffect(() => {
        getDocument()
    }, [])

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", setBackhandler)

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", setBackhandler)
        }
    }, [selectionMode])

    useEffect(() => {
        navigation.addListener("focus", setBackhandler)

        return () => {
            navigation.removeListener("focus", setBackhandler)
        }
    }, [])

    useEffect(() => {
        navigation.addListener("blur", () => {
            BackHandler.removeEventListener("hardwareBackPress", setBackhandler)
        })

        return () => {
            navigation.removeListener("blur", () => {
                BackHandler.removeEventListener("hardwareBackPress", setBackhandler)
            })
        }
    }, [])

    useEffect(() => {
        if (selectionMode) {
            setSelectedDocument([])
            setSelectionMode(false)
        }
    }, [document])


    return (
        <SafeScreen>
            <HomeHeader />

            <FlatList
                data={document}
                renderItem={({ item }) => (
                    <DocumentItem
                        click={() => openDocument(item)}
                        select={() => selectDocument(item.id)}
                        deselect={() => deselectDocument(item.id)}
                        selectionMode={selectionMode}
                        document={item}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeScreen>
    )
}

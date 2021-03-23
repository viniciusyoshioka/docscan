import React, { useCallback, useEffect, useState } from "react"
import { FlatList, View } from "react-native"

import { SafeScreen } from "../../component/Screen"
import { Document } from "../../service/object-types"
import { readDocument } from "../../service/storage"
import HomeHeader from "./Header"


export default function Home() {


    const [document, setDocument] = useState<Array<Document>>([])


    const getDocument = useCallback(async () => {
        const readDocumentList = await readDocument()
        setDocument(readDocumentList)
    }, [])


    useEffect(() => {
        getDocument()
    }, [])


    return (
        <SafeScreen>
            <HomeHeader />

            <FlatList
                data={document}
                renderItem={({ item }) => {
                    return (
                        <View />
                    )
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeScreen>
    )
}

import React, { useCallback, useState } from "react"
import { FlatList } from "react-native"
import { useNavigation } from "@react-navigation/core"

import { SafeScreen } from "../../component/Screen"
import { FileExplorerHeader } from "./Header"


export function FileExplorer() {


    const navigation = useNavigation()

    const [path, setPath] = useState("")
    const [pathContent, setPathContent] = useState([])


    const goBack = useCallback(() => {
        navigation.goBack()
    }, [])


    return (
        <SafeScreen>
            <FileExplorerHeader
                goBack={goBack}
            />

            <FlatList
                data={pathContent}
                renderItem={() => null}
            />
        </SafeScreen>
    )
}

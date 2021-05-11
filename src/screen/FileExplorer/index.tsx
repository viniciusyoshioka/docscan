import React, { useCallback, useState } from "react"
import { FlatList } from "react-native"
import { useNavigation } from "@react-navigation/core"
import RNFS from "react-native-fs"

import { SafeScreen } from "../../component/Screen"
import { FileExplorerHeader } from "./Header"
import { fullPathExported } from "../../service/constant"
import { FileExplorerItem } from "../../component/FileExplorerItem"


const defaultContent = [
    {name: "Dispositivo", path: RNFS.ExternalStorageDirectoryPath, isFile: false, isDir: true},
    {name: "Cartão de Memória", path: "", isFile: false, isDir: true},
    {name: "Documentos Exportados", path: fullPathExported, isFile: false, isDir: true}
]


export function FileExplorer() {


    const navigation = useNavigation()

    const [path, setPath] = useState<string | null>("")
    const [pathContent, setPathContent] = useState(defaultContent)


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
                renderItem={({ item }) => (
                    <FileExplorerItem
                        name={item.name}
                        path={item.path}
                        isFile={item.isFile}
                    />
                )}
            />
        </SafeScreen>
    )
}

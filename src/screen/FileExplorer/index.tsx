import React, { useCallback, useEffect, useState } from "react"
import { FlatList } from "react-native"
import { useNavigation } from "@react-navigation/core"
import RNFS, { ReadDirItem } from "react-native-fs"

import { SafeScreen } from "../../component/Screen"
import { FileExplorerHeader } from "./Header"
import { fullPathExported } from "../../service/constant"
import { FileExplorerItem } from "../../component/FileExplorerItem"
import { useBackHandler } from "../../service/hook"
import { SubHeaderPath, SubHeaderText } from "../../component/SubHeaderPath"
import { importDocument } from "../../service/document-handler"


const defaultContent: Array<ReadDirItem> = [
    {
        name: "Dispositivo",
        path: RNFS.ExternalStorageDirectoryPath,
        isFile: () => false,
        isDirectory: () => true,
        ctime: undefined,
        mtime: undefined,
        size: "",
    },
    {
        name: "Cartão de Memória",
        path: "/storage/extSdCard",
        isFile: () => false,
        isDirectory: () => true,
        ctime: undefined,
        mtime: undefined,
        size: "",
    },
    {
        name: "Documentos Exportados",
        path: fullPathExported,
        isFile: () => false,
        isDirectory: () => true,
        ctime: undefined,
        mtime: undefined,
        size: "",
    },
]


const returnDirectoryItem: ReadDirItem = {
    name: "..",
    path: "..",
    isFile: () => false,
    isDirectory: () => true,
    ctime: undefined,
    mtime: undefined,
    size: "",
}


export function FileExplorer() {


    const navigation = useNavigation()

    const [path, setPath] = useState<string | null>(null)
    const [pathContent, setPathContent] = useState<Array<ReadDirItem>>(defaultContent)


    useBackHandler(() => {
        goBack()
        return true
    })


    const upDirectory = useCallback(() => {
        if (path === null) {
            return
        } else if (path === RNFS.ExternalStorageDirectoryPath) {
            setPath(null)
            return
        } else if (path === "/storage/extSdCard") {
            setPath(null)
            return
        } else if (path === fullPathExported) {
            setPath(null)
            return
        }

        const splitedPath = path.split("/")
        let previewsPath = ""
        for (let x = 0; x < splitedPath.length - 1; x++) {
            if (x === 0) {
                previewsPath += `${splitedPath[x]}`    
            } else {
                previewsPath += `/${splitedPath[x]}`
            }
        }

        if (previewsPath === "") {
            setPath("/")
            return
        }
        setPath(previewsPath)
    }, [path])

    const changePath = useCallback((newPath: string, isFile: boolean) => {
        if (newPath === "..") {
            upDirectory()
        } else if (isFile) {
            importDocument(newPath)
                .then(() => {
                    navigation.reset({routes: [{name: "Home"}]})
                })
        } else {
            setPath(newPath)
        }
    }, [upDirectory])

    const goBack = useCallback(() => {
        if (path === null) {
            navigation.goBack()
            return
        } else if (path === "/") {
            setPath(null)
            return
        }
        changePath("..", false)
    }, [path, changePath])


    useEffect(() => {
        if (path === null) {
            setPathContent(defaultContent)
        } else {
            RNFS.readDir(path)
                .then((dirContent: Array<ReadDirItem>) => {
                    if (path === "/") {
                        setPathContent(dirContent)    
                    } else {
                        setPathContent([returnDirectoryItem, ...dirContent])
                    }
                })
        }
    }, [path])


    return (
        <SafeScreen>
            <FileExplorerHeader
                goBack={() => navigation.goBack()}
            />

            {path && (
                <SubHeaderPath>
                    <SubHeaderText>
                        {path}
                    </SubHeaderText>
                </SubHeaderPath>
            )}

            <FlatList
                data={pathContent}
                renderItem={({ item }) => (
                    <FileExplorerItem
                        name={item.name}
                        path={item.path}
                        isFile={item.isFile()}
                        onPress={() => changePath(item.path, item.isFile())}
                    />
                )}
                keyExtractor={(_item, index) => index.toString()}
                extraData={[changePath]}
                initialNumToRender={10}
            />
        </SafeScreen>
    )
}

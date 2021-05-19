import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/core"
import RNFS, { ReadDirItem } from "react-native-fs"

import { SafeScreen } from "../../component/Screen"
import { FileExplorerHeader } from "./Header"
import { fullPathExported } from "../../service/constant"
import { FileExplorerItem } from "../../component/FileExplorerItem"
import { useBackHandler } from "../../service/hook"
import { SubHeader, SubHeaderText } from "../../component/SubHeaderPath"
import { importDocument } from "../../service/document-handler"
import { log } from "../../service/log"


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

    const importDocumentAlert = useCallback((newPath: string) => {
        function importDocumentFunction(newPath: string) {
            importDocument(newPath)
                .then((isDocumentImported: boolean) => {
                    if (isDocumentImported) {
                        navigation.reset({ routes: [{ name: "Home" }] })
                        return
                    }
                })

            Alert.alert(
                "Aguarde",
                "Importar documentos pode demorar alguns instantes"
            )
        }

        Alert.alert(
            "Importar documento",
            "Deseja importar este documento?",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Importar", onPress: () => importDocumentFunction(newPath) }
            ]
        )
    }, [])

    const changePath = useCallback(async (newPath: string, isFile: boolean) => {
        if (newPath === "..") {
            upDirectory()
        } else if (isFile) {
            importDocumentAlert(newPath)
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
                .catch((error) => {
                    setPathContent([returnDirectoryItem])
                    log("ERROR", `Erro lendo pasta ao mudar de diretório. Mensagem: "${error}"`)
                    Alert.alert(
                        "Erro",
                        "Não foi possível abrir pasta"
                    )
                })
        }
    }, [path])


    return (
        <SafeScreen>
            <FileExplorerHeader
                goBack={() => navigation.goBack()}
            />

            {path && (
                <SubHeader>
                    <SubHeaderText>
                        {path}
                    </SubHeaderText>
                </SubHeader>
            )}

            <FlatList
                data={pathContent}
                renderItem={({ item }) => (
                    <FileExplorerItem
                        name={item.name}
                        path={item.path}
                        isFile={item.isFile()}
                        onPress={async () => await changePath(item.path, item.isFile())}
                    />
                )}
                keyExtractor={(_item, index) => index.toString()}
                extraData={[changePath]}
                initialNumToRender={10}
            />
        </SafeScreen>
    )
}

import React, { useEffect, useState } from "react"
import { Alert, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/core"
import RNFS, { ReadDirItem } from "react-native-fs"

import { FileExplorerHeader } from "./Header"
import { ListItem, SafeScreen, SubHeader, SubHeaderText } from "../../components"
import { fullPathExported } from "../../services/constant"
import { useBackHandler } from "../../services/hook"
import { log } from "../../services/log"
import { getReadPermission, getWritePermission } from "../../services/permission"
import { DocumentDatabase } from "../../database"
import { NavigationParamProps } from "../../types"


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


    const navigation = useNavigation<NavigationParamProps<"FileExplorer">>()

    const [path, setPath] = useState<string | null>(null)
    const [pathContent, setPathContent] = useState<Array<ReadDirItem>>(defaultContent)
    const [backToDefault, setBackToDefault] = useState(false)


    useBackHandler(() => {
        goBack()
        return true
    })


    function upDirectory() {
        switch (path) {
            case null:
                return
            case RNFS.ExternalStorageDirectoryPath:
                setPath(null)
                return
            case "/storage/extSdCard":
                setPath(null)
                return
            case fullPathExported:
                if (backToDefault) {
                    setPath(null)
                    setBackToDefault(false)
                    return
                }
                break
            default:
                break
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
    }

    async function importDocument(documentPathToImport: string) {
        const hasWritePermission = await getWritePermission()
        if (!hasWritePermission) {
            Alert.alert(
                "Erro",
                "Sem permissão para importar documento"
            )
            return
        }

        DocumentDatabase.importDocument(documentPathToImport)
            .then(() => {
                navigation.reset({ routes: [{ name: "Home" }] })
            })
            .catch((error) => {
                log.error(`Erro importando documento "${error}"`)
            })

        Alert.alert(
            "Aguarde",
            "Importar documentos pode demorar alguns instantes"
        )
    }

    function alertImportDocument(newPath: string) {
        Alert.alert(
            "Importar",
            "Deseja importar este documento?",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Importar", onPress: async () => await importDocument(newPath) }
            ]
        )
    }

    function changePath(newPath: string, isFile: boolean) {
        if (newPath === "..") {
            upDirectory()
        } else if (isFile) {
            alertImportDocument(newPath)
        } else {
            if (path === null && newPath === fullPathExported) {
                setBackToDefault(true)
            }
            setPath(newPath)
        }
    }

    function goBack() {
        if (path === null) {
            navigation.navigate("Home")
            return
        } else if (path === "/") {
            setPath(null)
            return
        }
        changePath("..", false)
    }

    function renderItem({ item }: { item: RNFS.ReadDirItem }) {
        return (
            <ListItem
                title={item.name}
                description={item.path}
                icon={item.isFile() ? "description" : "folder"}
                onPress={() => changePath(item.path, item.isFile())}
                style={{ height: 56 }}
            />
        )
    }

    async function readPath(pathToRead: string) {
        const hasReadPermission = await getReadPermission()
        if (!hasReadPermission) {
            Alert.alert(
                "Erro",
                "Sem permissão para ler caminho"
            )
            return
        }

        try {
            const pathContent = await RNFS.readDir(pathToRead)
            if (pathToRead === "/") {
                setPathContent(pathContent)
            } else {
                setPathContent([returnDirectoryItem, ...pathContent])
            }
        } catch (error) {
            setPathContent([returnDirectoryItem])
            log.error(`Erro lendo pasta ao mudar de diretório. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Não foi possível abrir pasta"
            )
        }
    }


    useEffect(() => {
        if (path === null) {
            setPathContent(defaultContent)
        } else {
            readPath(path)
        }
    }, [path])


    return (
        <SafeScreen>
            <FileExplorerHeader
                goBack={() => navigation.navigate("Home")}
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
                renderItem={renderItem}
                initialNumToRender={10}
            />
        </SafeScreen>
    )
}

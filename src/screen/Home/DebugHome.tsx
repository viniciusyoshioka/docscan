import React, { memo, useCallback } from "react"
import { Alert, View } from "react-native"
import RNFS from "react-native-fs"
import Share from "react-native-share"

import { DebugButton } from "../../component"
import { fullPathLog, fullPathPicture, fullPathRoot, fullPathTemporary, fullPathTemporaryCompressedPicture, fullPathTemporaryExported } from "../../service/constant"
import { useTheme } from "../../service/theme"


export interface DebugHomeProps {
    debugReadDocument: () => void,
    debugWriteDocument: () => void,
    debugClearDocument: () => void,
}


export const DebugHome = memo((props: DebugHomeProps) => {


    const { switchTheme } = useTheme()


    const debugReadLog = useCallback(async () => {
        try {
            if (await RNFS.exists(fullPathLog)) {
                RNFS.readFile(`${fullPathRoot}/docscanlog.log`)
                    .then((logContent) => {
                        console.log(`Arquivo de Log: "${logContent}"`)
                    })
                return
            }

            Alert.alert(
                "INFO",
                "Não há arquivo de log para ler",
                [{ text: "Ok", onPress: () => { } }],
                { cancelable: false }
            )
        } catch (error) {
            console.log(`FALHA MODERADA - Erro ao ler arquivo de log. Mensagem: "${error}"`)
            Alert.alert(
                "FALHA MODERADA",
                `Erro ao ler arquivo de log. Mensagem: "${error}"`,
                [{ text: "Ok", onPress: () => { } }],
                { cancelable: false }
            )
        }
    }, [])

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
                "Não há arquivo de log para compartilhar",
                [{ text: "Ok", onPress: () => { } }],
                { cancelable: false }
            )
        } catch (error) {
            console.log(`FALHA MODERADA - Erro ao compartilhar arquivo de log. Mensagem: "${error}"`)
            Alert.alert(
                "FALHA MODERADA",
                `Erro ao compartilhar arquivo de log. Mensagem: "${error}"`,
                [{ text: "Ok", onPress: () => { } }],
                { cancelable: false }
            )
        }
    }, [])

    const debugDeleteLog = useCallback(async () => {
        async function alertDeleteLogComplete() {
            try {
                if (await RNFS.exists(fullPathLog)) {
                    await RNFS.unlink(fullPathLog)

                    Alert.alert(
                        "INFO",
                        "Arquivo de log apagado com sucesso",
                        [{ text: "Ok", onPress: () => { } }],
                        { cancelable: false }
                    )
                    return
                }

                Alert.alert(
                    "INFO",
                    "Não há arquivo de log para ser apagado",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            } catch (error) {
                console.log(`FALHA MODERADA - Erro ao apagar arquivo de log. Mensagem: "${error}"`)
                Alert.alert(
                    "FALHA MODERADA",
                    "Erro ao apagar arquivo de log",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            }
        }

        Alert.alert(
            "AVISO",
            "Apagar arquivo de log?",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Ok", onPress: async () => await alertDeleteLogComplete() }
            ],
            { cancelable: false }
        )
    }, [])

    const debugReadAppFolder = useCallback(async () => {
        console.log("readAppFolder")

        console.log("========== cache ==========")
        if (await RNFS.exists(RNFS.CachesDirectoryPath)) {
            const pathCacheContent = await RNFS.readDir(RNFS.CachesDirectoryPath)
            pathCacheContent.forEach((item) => {
                console.log(item.path)
            })
            if (pathCacheContent.length === 0) {
                console.log("[]")
            }
        } else {
            console.log("Não existe")
        }

        console.log("========== fullPathRoot ==========")
        if (await RNFS.exists(fullPathRoot)) {
            const pathRootContent = await RNFS.readDir(fullPathRoot)
            pathRootContent.forEach((item) => {
                console.log(item.path)
            })
            if (pathRootContent.length === 0) {
                console.log("[]")
            }
        } else {
            console.log("Não existe")
        }

        console.log("========== fullPathPicture ==========")
        if (await RNFS.exists(fullPathPicture)) {
            const pathPictureContent = await RNFS.readDir(fullPathPicture)
            pathPictureContent.forEach((item) => {
                console.log(item.name)
            })
            if (pathPictureContent.length === 0) {
                console.log("[]")
            }
        } else {
            console.log("Não existe")
        }

        console.log("========== fullPathTemporary ==========")
        if (await RNFS.exists(fullPathTemporary)) {
            const pathTemporaryContent = await RNFS.readDir(fullPathTemporary)
            pathTemporaryContent.forEach((item) => {
                console.log(item.name)
            })
            if (pathTemporaryContent.length === 0) {
                console.log("[]")
            }
        } else {
            console.log("Não existe")
        }

        console.log("========== fullPathTemporaryCompressedPicture ==========")
        if (await RNFS.exists(fullPathTemporaryCompressedPicture)) {
            const pathTemporaryCompressedPictureContent = await RNFS.readDir(fullPathTemporaryCompressedPicture)
            pathTemporaryCompressedPictureContent.forEach((item) => {
                console.log(item.name)
            })
            if (pathTemporaryCompressedPictureContent.length === 0) {
                console.log("[]")
            }
        } else {
            console.log("Não existe")
        }

        console.log("========== fullPathTemporaryExported ==========")
        if (await RNFS.exists(fullPathTemporaryExported)) {
            const pathTemporaryExportedContent = await RNFS.readDir(fullPathTemporaryExported)
            pathTemporaryExportedContent.forEach((item) => {
                console.log(item.name)
            })
            if (pathTemporaryExportedContent.length === 0) {
                console.log("[]")
            }
        } else {
            console.log("Não existe")
        }

        console.log("====================")
    }, [])

    const debugDeleteAppPictureFolder = useCallback(() => {
        async function alertDeletePictureFolder() {
            try {
                if (await RNFS.exists(fullPathPicture)) {
                    const pictureFolderContent = await RNFS.readDir(fullPathPicture)
                    pictureFolderContent.forEach(async (item) => {
                        try {
                            await RNFS.unlink(item.path)
                        } catch (error) {
                            console.log(`FALHA MODERADA - Erro ao apagar item da pasta de imagens. Mensagem: "${error}"`)
                        }
                    })

                    Alert.alert(
                        "INFO",
                        "Conteúdo da pasta de imagens apagada com sucesso",
                        [{ text: "Ok", onPress: () => { } }],
                        { cancelable: false }
                    )
                    return
                }

                Alert.alert(
                    "FALHA GRAVE",
                    "Pasta de imagens não existe",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            } catch (error) {
                console.log(`FALHA MODERADA - Erro ao apagar conteúdo da pasta de imagens. Mensagem: "${error}"`)
                Alert.alert(
                    "FALHA MODERADA",
                    "Erro ao apagar conteúdo da pasta de imagens",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            }
        }

        Alert.alert(
            "AVISO",
            "Apagar conteúdo da pasta de imagens?",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Ok", onPress: async () => await alertDeletePictureFolder() }
            ],
            { cancelable: false }
        )
    }, [])

    const debugDeleteAppTemporaryExportedFolder = useCallback(() => {
        async function alertDeleteTemporaryExportedFolder() {
            try {
                if (await RNFS.exists(fullPathTemporaryExported)) {
                    const temporaryExportedFolderContent = await RNFS.readDir(fullPathTemporaryExported)
                    temporaryExportedFolderContent.forEach(async (item) => {
                        try {
                            await RNFS.unlink(item.path)
                        } catch (error) {
                            console.log(`FALHA MODERADA - Erro ao apagar item da pasta temporária de documentos exportados. Mensagem: "${error}"`)
                        }
                    })

                    Alert.alert(
                        "INFO",
                        "Conteúdo da pasta temporária de documentos exportados apagada com sucesso",
                        [{ text: "Ok", onPress: () => { } }],
                        { cancelable: false }
                    )
                    return
                }

                Alert.alert(
                    "FALHA GRAVE",
                    "Pasta temporária de documentos exportados não existe",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            } catch (error) {
                console.log(`FALHA MODERADA - Erro ao apagar conteúdo da pasta temporária de documentos exportados. Mensagem: "${error}"`)
                Alert.alert(
                    "FALHA MODERADA",
                    "Erro ao apagar conteúdo da pasta temporária de documentos exportados",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            }
        }

        Alert.alert(
            "AVISO",
            "Apagar conteúdo da pasta temporária de documentos exportados?",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Ok", onPress: async () => await alertDeleteTemporaryExportedFolder() }
            ],
            { cancelable: false }
        )
    }, [])

    const debugDeleteAppTemporaryCompressedPictureFolder = useCallback(() => {
        async function alertDeleteTemporaryCompressedPictureFolder() {
            try {
                if (await RNFS.exists(fullPathTemporaryCompressedPicture)) {
                    const temporaryCompressedPictureFolderContent = await RNFS.readDir(
                        fullPathTemporaryCompressedPicture
                    )
                    temporaryCompressedPictureFolderContent.forEach(async (item) => {
                        try {
                            await RNFS.unlink(item.path)
                        } catch (error) {
                            console.log(`FALHA MODERADA - Erro ao apagar item da pasta temporária de imagens comprimidas. Mensagem: "${error}"`)
                        }
                    })

                    Alert.alert(
                        "INFO",
                        "Conteúdo da pasta temporária de imagens comprimidas apagada com sucesso",
                        [{ text: "Ok", onPress: () => { } }],
                        { cancelable: false }
                    )
                    return
                }

                Alert.alert(
                    "FALHA GRAVE",
                    "Pasta temporária de imagens comprimidas não existe",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            } catch (error) {
                console.log(`FALHA MODERADA - Erro ao apagar conteúdo da pasta temporária de imagens comprimidas. Mensagem: "${error}"`)
                Alert.alert(
                    "FALHA MODERADA",
                    "Erro ao apagar conteúdo da pasta temporária de imagens comprimidas",
                    [{ text: "Ok", onPress: () => { } }],
                    { cancelable: false }
                )
            }
        }

        Alert.alert(
            "AVISO",
            "Apagar conteúdo da pasta temporária de imagens comprimidas?",
            [
                { text: "Cancelar", onPress: () => { } },
                { text: "Ok", onPress: async () => await alertDeleteTemporaryCompressedPictureFolder() }
            ],
            { cancelable: false }
        )
    }, [])


    return (
        <View>
            <DebugButton
                text={"Ler"}
                onPress={props.debugReadDocument}
                style={{ bottom: 115 }} />
            <DebugButton
                text={"Escre"}
                onPress={props.debugWriteDocument}
                style={{ bottom: 60 }} />
            <DebugButton
                text={"Limpar"}
                onPress={props.debugClearDocument}
                style={{ bottom: 5 }} />

            <DebugButton
                text={"Auto"}
                onPress={async () => await switchTheme("auto")}
                style={{ bottom: 115, left: 60 }} />
            <DebugButton
                text={"Claro"}
                onPress={async () => await switchTheme("light")}
                style={{ bottom: 60, left: 60 }} />
            <DebugButton
                text={"Escuro"}
                onPress={async () => await switchTheme("dark")}
                style={{ bottom: 5, left: 60 }} />

            <DebugButton
                text={"Ler"}
                onPress={debugReadLog}
                style={{ bottom: 115, left: 115 }} />
            <DebugButton
                text={"Compar"}
                onPress={debugShareLog}
                style={{ bottom: 60, left: 115 }} />
            <DebugButton
                text={"Apagar"}
                onPress={debugDeleteLog}
                style={{ bottom: 5, left: 115 }}
            />

            <DebugButton
                text={"Ler"}
                onPress={debugReadAppFolder}
                style={{ bottom: 170, left: 170 }} />
            <DebugButton
                text={"Imag"}
                onPress={debugDeleteAppPictureFolder}
                style={{ bottom: 115, left: 170 }} />
            <DebugButton
                text={"Temp Export"}
                onPress={debugDeleteAppTemporaryExportedFolder}
                style={{ bottom: 60, left: 170 }} />
            <DebugButton
                text={"Temp Compri"}
                onPress={debugDeleteAppTemporaryCompressedPictureFolder}
                style={{ bottom: 5, left: 170 }} />
        </View>
    )
})

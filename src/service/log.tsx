import { Alert, ToastAndroid } from "react-native"
import RNFS from "react-native-fs"

import { appInDevelopment, fullPathLog } from "./constant"
import { getReadWritePermission, ReadWritePermissionResul } from "./permission"


export type logCode = "INFO" | "WARN" | "ERROR"


export function log(code: logCode, data: string) {
    if (!appInDevelopment) {
        return
    }

    getReadWritePermission()
        .then((logPermission: ReadWritePermissionResul) => {
            if (!logPermission.READ_EXTERNAL_STORAGE || !logPermission.WRITE_EXTERNAL_STORAGE) {
                ToastAndroid.show("Permissão negada para registrar logs", 10)
                return false
            }
            return true
        })
        .then(async (hasPermission: boolean) => {
            if (!hasPermission) {
                return false
            }
            try {
                const fileExists = await RNFS.exists(fullPathLog)
                if (!fileExists) {
                    await RNFS.writeFile(fullPathLog, "")
                }
                return true
            } catch (error) {
                console.log(`FALHA CRÍTICA - Erro criando arquivo de log. Mensagem: "${error}"`)
                Alert.alert(
                    "FALHA CRÍTICA",
                    `Erro criando arquivo de log. Mensagem: "${error}"`
                )
                return false
            }
        })
        .then(async (hasPermission: boolean) => {
            if (!hasPermission) {
                return false
            }
            console.log(`${code} - ${data}`)
            try {
                await RNFS.appendFile(fullPathLog, `${code} - ${data}\n`)
            } catch (error) {
                console.log(`FALHA CRÍTICA - Erro registrando log. Mensagem: "${error}"`)
                Alert.alert(
                    "FALHA CRÍTICA",
                    `Erro registrando log. Mensagem: "${error}"`
                )
            }
        })
}

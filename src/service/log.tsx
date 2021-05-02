import { Alert, ToastAndroid } from "react-native"
import RNFS from "react-native-fs"

import { fullPathLog } from "./constant"
import { logCode } from "./object-types"
import { getLogPermission } from "./permission"


async function createLogFile(): Promise<void> {
    const fileExists = await RNFS.exists(fullPathLog)

    if (!fileExists) {
        try {
            await RNFS.writeFile(fullPathLog, "")
        } catch (error) {
            console.log(`FALHA CRÍTICA - Erro criando arquivo de log. Mensagem: "${error}"`)
            Alert.alert(
                "FALHA CRÍTICA",
                `Erro criando arquivo de log. Mensagem: "${error}"`
            )
        }
    }
}


export async function log(code: logCode, data: string): Promise<void> {
    const logPermission = await getLogPermission()
    if (!logPermission.READ_EXTERNAL_STORAGE || !logPermission.WRITE_EXTERNAL_STORAGE) {
        ToastAndroid.show("Permissão negada para registrar logs", 10)
        return
    }

    await createLogFile()

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
}

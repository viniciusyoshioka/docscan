import { Alert } from "react-native"
import RNFS from "react-native-fs"

import { fullPathLog } from "./constant"
import { logCode } from "./object-types"


async function createLogFile() {
    if (await RNFS.exists(fullPathLog)) {
        return
    }

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


export async function log(code: logCode, data: string) {
    await createLogFile()

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

import { Alert } from "react-native"
import RNFS from "react-native-fs"

import { fullPathRoot } from "./constant"
import { getDate } from "./date"
import { logCode } from "./object-types"


async function createLogFile(filePath: string) {
    if (await RNFS.exists(filePath)) {
        return
    }

    try {
        await RNFS.writeFile(filePath, "")
    } catch (error) {
        console.log(error)
        Alert.alert(
            "FALHA CRÍTICA",
            `Erro criando arquivo de log. Mensagem: "${error}"`
        )
    }
}


export async function log(code: logCode, data: string) {
    const dateTime = getDate(Date(), "-")
    const logFilePath = `${fullPathRoot}/${dateTime}.log`

    await createLogFile(logFilePath)

    try {
        await RNFS.appendFile(logFilePath, `${code} - ${data}`)
    } catch (error) {
        console.log(error)
        Alert.alert(
            "FALHA CRÍTICA",
            `Erro registrando log. Mensagem: "${error}"`
        )
    }
}

import { Alert } from "react-native"
import RNFS from "react-native-fs"

import { fullPathLog } from "./constant"
import { logCode } from "./object-types"


function createLogFile(): void {
    RNFS.exists(fullPathLog)
        .then((exists) => {
            if (!exists) {
                RNFS.writeFile(fullPathLog, "")
                    .catch((error) => {
                        console.log(`FALHA CRÍTICA - Erro criando arquivo de log. Mensagem: "${error}"`)
                        Alert.alert(
                            "FALHA CRÍTICA",
                            `Erro criando arquivo de log. Mensagem: "${error}"`
                        )
                    })
            }
        })
}


export function log(code: logCode, data: string): void {
    createLogFile()

    console.log(`${code} - ${data}`)

    RNFS.appendFile(fullPathLog, `${code} - ${data}\n`)
        .catch((error) => {
            console.log(`FALHA CRÍTICA - Erro registrando log. Mensagem: "${error}"`)
            Alert.alert(
                "FALHA CRÍTICA",
                `Erro registrando log. Mensagem: "${error}"`
            )
        })
}

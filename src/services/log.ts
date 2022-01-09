import { Alert } from "react-native"
import { logger } from "react-native-logs"

import { LogDatabase } from "../database"
import { Logger, TransportFunctionProps } from "../types"
import { getDateTime } from "./date"


export function logCriticalError(message: string) {
    console.log(`FALHA CRÍTICA - Erro registrando log. Mensagem: "${message}"`)
    Alert.alert(
        "FALHA CRÍTICA",
        `Erro registrando log. Mensagem: "${message}"`
    )
}


async function databaseTransport(props: TransportFunctionProps) {
    try {
        let color
        switch (props.level.text) {
            case "info":
                color = "\x1b[96m"
                break
            case "warn":
                color = "\x1b[93m"
                break
            case "error":
                color = "\x1b[97;41m"
                break
            default:
                break
        }

        const datetime = getDateTime("/", ":", true)
        const level = props.level.text.toUpperCase().padEnd(5)
        const message = props.rawMsg.join(" ")

        console.log(`${color}[${datetime}] ${level} - ${message}\x1b[m`)

        await LogDatabase.insertLog(level, message)
    } catch (error) {
        logCriticalError(error as string)
    }
}


export const log = logger.createLogger({
    severity: __DEV__ ? "debug" : "warn",
    transport: databaseTransport,
    async: true,
}) as unknown as Logger

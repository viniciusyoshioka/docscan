import { Alert } from "react-native"
import { logger } from "react-native-logs"

import { LogDatabase } from "../database"
import { Logger, TransportFunctionProps } from "../types"
import { getDateTime } from "./date"


/**
 * Receives an error and converts it from any type to string
 *
 * @param error string or object with the error message
 *
 * @returns string of the error provided
 */
export function stringfyError(error: unknown): string {
    if (typeof error === "string") {
        return error
    }

    const stringfiedObject = JSON.stringify(error)
    if (stringfiedObject === "{}") {
        return error as string
    }

    return stringfiedObject
}


/**
 * Function to log critical errors only.
 * Use this function when Logger or database is not available.
 *
 * @param message a string with the error message to be logged
 */
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
        const errorMessage: string = typeof error === "object"
            ? JSON.stringify(error)
            : error as string
        logCriticalError(errorMessage)
    }
}


/**
 * Logger object.
 * Can register logs in database and print it in terminal
 */
export const log = logger.createLogger({
    severity: __DEV__ ? "debug" : "warn",
    transport: databaseTransport,
    async: true,
}) as unknown as Logger

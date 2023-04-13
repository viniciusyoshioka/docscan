import { Alert } from "react-native"
import { logger } from "react-native-logs"

import { LogDatabase } from "../../database"
import { translate } from "../../locales"
import { getDateTime } from "../date"
import { Logger, TransportFunctionProps } from "./types"


export function stringfyError(error: unknown): string {
    if (typeof error === "string") {
        return error
    }

    const stringifiedObject = JSON.stringify(error)
    if (stringifiedObject === "{}") {
        return error as string
    }

    return stringifiedObject
}


export function logCriticalError(error: unknown) {
    const stringifiedError = stringfyError(error)

    console.log(`CRITICAL ERROR - Error registering log. "${stringifiedError}"`)
    Alert.alert(
        translate("criticalError"),
        `${translate("log_alert_errorRegisteringLog_text")} "${stringifiedError}"`
    )
}


async function databaseTransport(props: TransportFunctionProps) {
    const resetColor = "\x1b[m"

    let color = ""
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

    const datetime = getDateTime()
    const level = props.level.text.toUpperCase().padEnd(5)
    const message = props.rawMsg.join(" ")
    console.log(`${color}[${datetime}] ${level} - ${message}${resetColor}`)

    try {
        await LogDatabase.insertLog(level, message)
    } catch (error) {
        logCriticalError(error)
    }
}


export const log = logger.createLogger({
    severity: __DEV__ ? "debug" : "warn",
    transport: databaseTransport,
    async: true,
}) as unknown as Logger

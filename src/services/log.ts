import { Realm } from "@realm/react"
import { Alert } from "react-native"

import { LogSchema } from "../database"
import { translate } from "../locales"
import { getDateTime } from "./date"


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


class Logger {


    private realm: Realm | undefined

    private consoleResetColor = "\x1b[m"
    private consoleInfoColor = "\x1b[96m"
    private consoleWarnColor = "\x1b[93m"
    private consoleErrorColor = "\x1b[97;41m"


    setRealm(realm: Realm) {
        this.realm = realm
    }


    debug(message: string) {
        const timestamp = Date.now()
        const logDateTime = getDateTime(new Date(timestamp))
        const code = "DEBUG".padEnd(5)

        console.log(`[${logDateTime}] ${code} - ${message}`)

        if (!this.realm) {
            console.warn("Realm not set to Logger. Log not registered.")
            return
        }

        try {
            this.realm.write(() => {
                if (!this.realm) return
                this.realm.create<LogSchema>("LogSchema", { code, message, timestamp })
            })
        } catch (error) {
            logCriticalError(error)
        }
    }

    info(message: string) {
        const timestamp = Date.now()
        const logDateTime = getDateTime(new Date(timestamp))
        const code = "INFO".padEnd(5)

        console.log(`${this.consoleInfoColor}[${logDateTime}] ${code} - ${message}${this.consoleResetColor}`)

        if (!this.realm) {
            console.warn("Realm not set to Logger. Log not registered.")
            return
        }

        try {
            this.realm.write(() => {
                if (!this.realm) return
                this.realm.create<LogSchema>("LogSchema", { code, message, timestamp })
            })
        } catch (error) {
            logCriticalError(error)
        }
    }

    warn(message: string) {
        const timestamp = Date.now()
        const logDateTime = getDateTime(new Date(timestamp))
        const code = "WARN".padEnd(5)

        console.log(`${this.consoleWarnColor}[${logDateTime}] ${code} - ${message}${this.consoleResetColor}`)

        if (!this.realm) {
            console.warn("Realm not set to Logger. Log not registered.")
            return
        }

        try {
            this.realm.write(() => {
                if (!this.realm) return
                this.realm.create<LogSchema>("LogSchema", { code, message, timestamp })
            })
        } catch (error) {
            logCriticalError(error)
        }
    }

    error(message: string) {
        const timestamp = Date.now()
        const logDateTime = getDateTime(new Date(timestamp))
        const code = "ERROR".padEnd(5)

        console.log(`${this.consoleErrorColor}[${logDateTime}] ${code} - ${message}${this.consoleResetColor}`)

        if (!this.realm) {
            console.warn("Realm not set to Logger. Log not registered.")
            return
        }

        try {
            this.realm.write(() => {
                if (!this.realm) return
                this.realm.create<LogSchema>("LogSchema", { code, message, timestamp })
            })
        } catch (error) {
            logCriticalError(error)
        }
    }
}


export const log = new Logger()

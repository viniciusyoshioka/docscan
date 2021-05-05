import AsyncStorage from "@react-native-async-storage/async-storage"

import { debugHomeDefault, storageDebugHome, storageDocument, storageDocumentId, storageSettings, storageTheme } from "./constant"
import { log } from "./log"
import { Document } from "./object-types"
import { settingsDefault, SettingsProps } from "./settings"
import { themeDefault, themeType } from "./theme"


async function write(key: string, value: string) {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (error) {
        log("ERROR", `storage write - Erro ao definir item no AsyncStorage. Mensagem: "${error}"`)
    }
}

async function read(key: string): Promise<string | null> {
    try {
        const readValue = await AsyncStorage.getItem(key)
        return readValue
    } catch (error) {
        log("ERROR", `storage read - Erro ao ler item do AsyncStorage. Mensagem: "${error}"`)
        return null
    }
}


export async function writeTheme(value: themeType) {
    await write(storageTheme, value)
}

export async function readTheme(): Promise<themeType> {
    const theme = await read(storageTheme)
    if (theme === null) {
        await writeTheme(themeDefault)
        return themeDefault
    }
    return theme as themeType
}


export async function writeDocumentId(value: Array<number>) {
    await write(storageDocumentId, JSON.stringify(value))
}

export async function readDocumentId(): Promise<Array<number>> {
    const documentId = await read(storageDocumentId)
    if (documentId === null) {
        await writeDocumentId([])
        return []
    }
    return JSON.parse(documentId)
}


export async function writeDocument(value: Array<Document>) {
    await write(storageDocument, JSON.stringify(value))
}

export async function readDocument(): Promise<Array<Document>> {
    const document = await read(storageDocument)
    if (document === null) {
        await writeDocument([])
        return []
    }
    return JSON.parse(document)
}


export async function writeDebugHome(value: string) {
    await write(storageDebugHome, value)
}

export async function readDebugHome(): Promise<string> {
    const debugHome = await read(storageDebugHome)
    if (debugHome === null) {
        await writeDebugHome(debugHomeDefault)
        return debugHomeDefault
    }
    return debugHome
}


export async function writeSettings(value: SettingsProps) {
    await write(storageSettings, JSON.stringify(value))
}

export async function readSettings(): Promise<SettingsProps> {
    const settings = await read(storageSettings)
    if (settings === null) {
        await writeSettings(settingsDefault)
        return settingsDefault
    }
    return JSON.parse(settings)
}

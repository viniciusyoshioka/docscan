import AsyncStorage from "@react-native-async-storage/async-storage"

import { debugHomeDefault, settingsDefault, storageDebugHome, storageDocument, storageDocumentId, storageSettings, storageTheme, themeDefault } from "./constant"
import { log } from "./log"
import { Document, SettingsProps } from "./object-types"


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


export async function writeTheme(newTheme: string) {
    await write(storageTheme, newTheme)
}

export async function readTheme(): Promise<string> {
    let theme = await read(storageTheme)
    if (theme === null) {
        await writeTheme(themeDefault)
        return themeDefault
    }
    return theme
}


export async function writeDocumentId(newDocumentId: Array<number>) {
    await write(storageDocumentId, JSON.stringify(newDocumentId))
}

export async function readDocumentId(): Promise<Array<number>> {
    let documentId = await read(storageDocumentId)
    if (documentId === null) {
        await writeDocumentId([])
        return []
    }
    return JSON.parse(documentId)
}


export async function writeDocument(newDocument: Array<Document>) {
    await write(storageDocument, JSON.stringify(newDocument))
}

export async function readDocument(): Promise<Array<Document>> {
    let document = await read(storageDocument)
    if (document === null) {
        await writeDocument([])
        return []
    }
    return JSON.parse(document)
}


export async function writeDebugHome(newDebugHome: string) {
    await write(storageDebugHome, newDebugHome)
}

export async function readDebugHome(): Promise<string> {
    let debugHome = await read(storageDebugHome)
    if (debugHome === null) {
        await writeDebugHome(debugHomeDefault)
        return debugHomeDefault
    }
    return debugHome
}


export async function writeSettings(newSettings: SettingsProps) {
    await write(storageSettings, JSON.stringify(newSettings))
}

export async function readSettings(): Promise<SettingsProps> {
    let settings = await read(storageSettings)
    if (settings === null) {
        await writeSettings(settingsDefault)
        return settingsDefault
    }
    return JSON.parse(settings)
}

import AsyncStorage from "@react-native-async-storage/async-storage"

import { debugHomeDefault, settingsDefault, storageDebugHome, storageDocument, storageDocumentId, storageSettings, storageTheme, themeDefault } from "./constant"
import { Document, SettingsProps } from "./object-types"


export async function writeTheme(newTheme: string) {
    await AsyncStorage.setItem(storageTheme, newTheme)
}

export async function readTheme(): Promise<string> {
    let theme = await AsyncStorage.getItem(storageTheme)
    if (theme === null) {
        await writeTheme(themeDefault)
        return themeDefault
    }
    return theme
}


export async function writeDocumentId(newDocumentId: Array<number>) {
    await AsyncStorage.setItem(storageDocumentId, JSON.stringify(newDocumentId))
}

export async function readDocumentId(): Promise<Array<number>> {
    let documentId = await AsyncStorage.getItem(storageDocumentId)
    if (documentId === null) {
        await writeDocumentId([])
        return []
    }
    return JSON.parse(documentId)
}


export async function writeDocument(newDocument: Array<Document>) {
    await AsyncStorage.setItem(storageDocument, JSON.stringify(newDocument))
}

export async function readDocument(): Promise<Array<Document>> {
    let document = await AsyncStorage.getItem(storageDocument)
    if (document === null) {
        await writeDocument([])
        return []
    }
    return JSON.parse(document)
}


export async function writeDebugHome(newDebugHome: string) {
    await AsyncStorage.setItem(storageDebugHome, newDebugHome)
}

export async function readDebugHome(): Promise<string> {
    let debugHome = await AsyncStorage.getItem(storageDebugHome)
    if (debugHome === null) {
        await writeDebugHome(debugHomeDefault)
        return debugHomeDefault
    }
    return debugHome
}


export async function writeSettings(newSettings: SettingsProps) {
    await AsyncStorage.setItem(storageSettings, JSON.stringify(newSettings))
}

export async function readSettings(): Promise<SettingsProps> {
    let settings = await AsyncStorage.getItem(storageSettings)
    if (settings === null) {
        await writeSettings(settingsDefault)
        return settingsDefault
    }
    return JSON.parse(settings)
}

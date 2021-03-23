import AsyncStorage from "@react-native-async-storage/async-storage"

import { storageDocument, storageDocumentId, storageTheme, themeDefault } from "./constant"
import { Document } from "./object-types"


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

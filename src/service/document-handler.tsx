import RNFS from "react-native-fs"

import { getDateTime } from "./date"
import { log } from "./log";
import { Document } from "./object-types";
import { readDocument, readDocumentId, writeDocument, writeDocumentId } from "./storage";


export async function getId(): Promise<number> {
    const documentId = await readDocumentId()

    let minimumId = 0
    while (true) {
        if (documentId.indexOf(minimumId) === -1) {
            return minimumId
        }
        minimumId += 1
    }
}


export function getDocumentName(): string {
    return `Documento ${getDateTime("-", "-", true)}`
}


async function createDocument(name: string, pictureList: Array<string>): Promise<Document> {
    const id = await getId()
    const date = getDateTime()
    return {
        id: id,
        name: name,
        pictureList: pictureList,
        lastModificationDate: date
    }
}

export async function saveNewDocument(name: string, pictureList: Array<string>): Promise<Document> {
    const newDocument = await createDocument(name, pictureList)

    // documentId
    const documentId = await readDocumentId()
    documentId.unshift(newDocument.id)
    await writeDocumentId(documentId)

    // document
    const documentList = await readDocument()
    documentList.unshift(newDocument)
    await writeDocument(documentList)

    return newDocument
}


async function editDocument(document: Document, name: string, pictureList: Array<string>): Promise<Document> {
    const date = getDateTime()
    return {
        id: document.id,
        name: name,
        pictureList: pictureList,
        lastModificationDate: date
    }
}

export async function saveEditedDocument(document: Document, name: string, pictureList: Array<string>): Promise<Document> {
    await deleteDocument([document.id])
    
    const editedDocument = await editDocument(document, name, pictureList)

    // documentId
    const documentId = await readDocumentId()
    documentId.unshift(editedDocument.id)
    await writeDocumentId(documentId)

    // document
    const documentList = await readDocument()
    documentList.unshift(editedDocument)
    await writeDocument(documentList)

    return editedDocument
}


export async function deleteDocument(ids: Array<number>, deleteFiles=false) {
    // documentId
    const documentId = await readDocumentId()
    const documentIdIndex: Array<number> = []
    documentId.forEach((item: number, index: number) => {
        if (ids.indexOf(item) !== -1) {
            documentIdIndex.push(index)
        }
    })
    documentIdIndex.reverse()
    documentIdIndex.forEach((item: number) => {
        documentId.splice(item, 1)
    })
    await writeDocumentId(documentId)

    // document
    const document = await readDocument()
    const documentIndex: Array<number> = []
    document.forEach((item: Document, index: number) => {
        if (ids.indexOf(item.id) !== -1) {
            // Add document index to delete
            documentIndex.push(index)
            // Delete all pictures from this document
            if (deleteFiles) {
                item.pictureList.forEach(async (picturePath: string) => {
                    try {
                        await RNFS.unlink(picturePath)
                    } catch (error) {
                        log("ERROR", `document-handler deleteDocument - Erro ao apagar picture da pictureList no processo de apagar documento. Mensagem: "${error}"`)
                    }
                })
            }
        }
    })
    documentIndex.reverse()
    documentIndex.forEach((item: number) => {
        document.splice(item, 1)
    })
    await writeDocument(document)
}

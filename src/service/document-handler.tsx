import { Alert, ToastAndroid } from "react-native"
import base64 from "react-native-base64"
import { zip } from "react-native-zip-archive"
import RNFS from "react-native-fs"

import { getDateTime } from "./date"
import { log } from "./log"
import { Document, ExportedDocument } from "./object-types"
import { readDocument, readDocumentId, writeDocument, writeDocumentId } from "./storage"
import { fullPathExported, fullPathTemporary } from "./constant"
import { createExportedFolder, createTemporaryFolder } from "./folder-handler"


export async function getId(): Promise<number> {
    const documentId = await readDocumentId()

    let minimumId = 0
    while (documentId.includes(minimumId)) {
        minimumId += 1
    }
    return minimumId
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

export async function saveEditedDocument(
    document: Document,
    name: string,
    pictureList: Array<string>
): Promise<Document> {
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


export async function deleteDocument(ids: Array<number>, deleteFiles = false) {
    // documentId
    const documentId = await readDocumentId()
    const documentIdIndex: Array<number> = []
    documentId.forEach((item: number, index: number) => {
        if (ids.includes(item)) {
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
        if (ids.includes(item.id)) {
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


export async function exportDocument(ids: Array<number>, selectionMode: boolean) {
    // Filter only selected documents
    const document = await readDocument()

    // Check if there is document to export in app
    if (document.length === 0) {
        Alert.alert(
            "Aviso",
            "Não há documentos para exportar"
        )
        return
    }

    // Get document to export
    let documentToExport: Array<ExportedDocument> = []
    if (selectionMode) {
        const tempDocumentToExport = document.filter((item: Document) => {
            return ids.includes(item.id)
        })
        documentToExport = tempDocumentToExport.map((item: Document) => {
            return {
                name: item.name,
                pictureList: item.pictureList,
            }
        })
    } else {
        documentToExport = document.map((item: Document) => {
            return {
                name: item.name,
                pictureList: item.pictureList,
            }
        })
    }

    // Create required folders
    await createExportedFolder()
    await createTemporaryFolder()

    // Create file with document data
    const filepath = `${fullPathTemporary}/index.txt`
    const content = base64.encode(JSON.stringify(documentToExport))
    try {
        await RNFS.writeFile(filepath, content, "base64")
    } catch (error) {
        log("ERROR", `Erro criando arquivo de documentos para exportar. Mensagem: "${error}"`)
        Alert.alert(
            "Erro",
            "Erro ao exportar documentos. Processo interrompido"
        )
        return
    }

    // Copy pictures
    documentToExport.forEach((documentItem: ExportedDocument) => {
        documentItem.pictureList.forEach(async (pictureItem: string) => {
            const splitedPath = pictureItem.split("/")
            const fileName = splitedPath[splitedPath.length - 1]
            try {
                await RNFS.copyFile(pictureItem, `${fullPathTemporary}/${fileName}`)
            } catch (error) {
                log("ERROR", `Erro copiando imagens de sua origem para pasta temporária para exportar documentos. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro",
                    "Erro ao exportar documentos. Processo interrompido"
                )
                return
            }
        })
    })

    // Create document name
    const zipDocumentName = getDateTime("-", "-", true)
    let zipDocumentPath = `${fullPathExported}/${zipDocumentName}.zip`

    // Rename document name, if already exists
    let counter = 0
    while (await RNFS.exists(zipDocumentPath)) {
        zipDocumentPath = `${fullPathExported}/${zipDocumentName} - ${counter}.zip`
        counter += 1
    }

    // Zip documents
    try {
        await zip(fullPathTemporary, zipDocumentPath)
    } catch (error) {
        log("ERROR", `Erro compactando documentos para exportar. Mensagem: "${error}"`)
        Alert.alert(
            "Erro",
            "Erro ao exportar documentos. Processo interrompido"
        )
        return
    }

    // Clear temporary files
    try {
        await RNFS.unlink(`${fullPathTemporary}`)
    } catch (error) {
        log("ERROR", `Erro apagando arquivos temporários depois de exportar documentos. Mensagem: "${error}"`)
    }

    // Alert export has finished
    ToastAndroid.show(`Documentos exportados para "Exportado/${zipDocumentName}"`, 10)
}

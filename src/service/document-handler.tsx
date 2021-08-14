import { Alert, ToastAndroid } from "react-native"
import base64 from "react-native-base64"
import { zip, unzip } from "react-native-zip-archive"
import RNFS, { ReadDirItem } from "react-native-fs"

import { getDateTime } from "./date"
import { log } from "./log"
import { Document, ExportedDocument } from "./object-types"
import { readDocument, readDocumentId, writeDocument, writeDocumentId } from "./storage"
import { fullPathExported, fullPathPicture, fullPathTemporaryExported } from "./constant"
import { createExportedFolder } from "./folder-handler"


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


export async function exportDocument(ids: Array<number>, selectionMode: boolean): Promise<boolean> {
    // Filter only selected documents
    const document = await readDocument()

    // Check if there is document to export in app
    if (document.length === 0) {
        Alert.alert(
            "Aviso",
            "Não há documentos para exportar"
        )
        return false
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

    // Create file with document data
    const filepath = `${fullPathTemporaryExported}/index.txt`
    const content = base64.encode(JSON.stringify(documentToExport))
    try {
        await RNFS.writeFile(filepath, content, "base64")
    } catch (error) {
        log("ERROR", `Erro criando índice de documentos para exportar. Mensagem: "${error}"`)
        Alert.alert(
            "Erro",
            "Erro desconhecido ao exportar documentos. Processo interrompido"
        )
        return false
    }

    // Copy pictures
    // Iteration for each document in the documentToExport
    for (let x = 0; x < documentToExport.length; x++) {
        const documentItem = documentToExport[x]

        // Iteration for each picture path in the documentItem
        for (let y = 0; y < documentItem.pictureList.length; y++) {
            const pictureItem = documentItem.pictureList[y]

            const splitedPath = pictureItem.split("/")
            const fileName = splitedPath[splitedPath.length - 1]
            try {
                await RNFS.copyFile(pictureItem, `${fullPathTemporaryExported}/${fileName}`)
            } catch (error) {
                log("ERROR", `Erro copiando imagens de sua origem para pasta temporária para exportar documentos. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro",
                    "Erro desconhecido ao exportar documentos. Processo interrompido"
                )
                return false
            }
        }
    }

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
        await zip(fullPathTemporaryExported, zipDocumentPath)
    } catch (error) {
        log("ERROR", `Erro compactando documentos para exportar. Mensagem: "${error}"`)
        Alert.alert(
            "Erro",
            "Erro desconhecido ao exportar documentos. Processo interrompido"
        )
        return false
    }

    // Clear temporary files used on this export
    try {
        await RNFS.unlink(filepath)
    } catch (error) {
        log("ERROR", `Erro apagando índice depois de exportar documentos. Mensagem: "${error}"`)
    }
    for (let x = 0; x < documentToExport.length; x++) {
        const documentItem = documentToExport[x]

        // Iteration for each picture path in the documentItem
        for (let y = 0; y < documentItem.pictureList.length; y++) {
            const pictureItem = documentItem.pictureList[y]

            const splitedPath = pictureItem.split("/")
            const fileName = splitedPath[splitedPath.length - 1]
            const imageInTemporaryPath = `${fullPathTemporaryExported}/${fileName}`
            try {
                await RNFS.unlink(imageInTemporaryPath)
            } catch (error) {
                log("ERROR", `Erro apagando imagem da pasta temporária de exportação depois de exportar documentos. Mensagem: "${error}"`)
            }
        }
    }

    // Alert export has finished
    ToastAndroid.show(`Documentos exportados para "Exportado/${zipDocumentName}"`, 10)
    return true
}

export async function importDocument(path: string): Promise<boolean> {
    // Check if file to import exists
    if (!await RNFS.exists(path)) {
        Alert.alert(
            "Erro",
            "Arquivo selecionado não existe"
        )
        return false
    }

    // Check file extension
    const splitedPath = path.split("/")
    const fileName = splitedPath[splitedPath.length - 1]
    if (!fileName.endsWith(".zip")) {
        Alert.alert(
            "Erro",
            "Arquivo selecionado não é um documento exportado"
        )
        return false
    }

    // Create temporary folder
    // await ctempf()

    // Unzip file
    try {
        await unzip(path, fullPathTemporaryExported)
    } catch (error) {
        log("ERROR", `Erro ao descompactar documento a ser importado. Mensagem: "${error}"`)
        Alert.alert(
            "Erro",
            "Erro desconhecido ao importar documentos. Processo interrompido"
        )
        return false
    }

    // Check if unziped items are document
    if (!await RNFS.exists(`${fullPathTemporaryExported}/index.txt`)) {
        log("ERROR", "Arquivo zip verificado não é compatível com documento")

        try {
            const temporaryExportedContent = await RNFS.readDir(`${fullPathTemporaryExported}`)
            temporaryExportedContent.forEach(async (item: ReadDirItem) => {
                await RNFS.unlink(item.path)
            })
        } catch (error) {
            log("ERROR", `Erro apagando item da pasta temporária de documentos exportados depois de verificar que arquivo não é compatível com documento. Mensagem: "${error}"`)
        }

        Alert.alert(
            "Erro",
            "Arquivo selecionado não é um documento exportado. Processo interrompido"
        )
        return false
    }

    // Read document file
    let fileContent: string
    try {
        fileContent = await RNFS.readFile(`${fullPathTemporaryExported}/index.txt`, "base64")
    } catch (error) {
        log("ERROR", `Erro lendo arquivo de documentos para importar. Mensagem: "${error}"`)
        Alert.alert(
            "Erro",
            "Erro desconhecido ao importar documentos. Processo interrompido"
        )
        return false
    }
    const exportedDocumentData: Array<ExportedDocument> = JSON.parse(base64.decode(fileContent))
    const importedDocument: Array<Document> = []
    for (let x = 0; x < exportedDocumentData.length; x++) {
        // Create and add document
        const doc = await createDocument(
            exportedDocumentData[x].name, exportedDocumentData[x].pictureList
        )
        importedDocument.push(doc)

        // Write new document id
        const documentId = await readDocumentId()
        documentId.push(doc.id)
        await writeDocumentId(documentId)
    }

    // Move picture file from temporary folder to picture folder
    for (let documentItemIndex = 0; documentItemIndex < importedDocument.length; documentItemIndex++) {
        const documentItem = importedDocument[documentItemIndex]

        for (let pictureItemIndex = 0; pictureItemIndex < documentItem.pictureList.length; pictureItemIndex++) {
            const pictureItem = documentItem.pictureList[pictureItemIndex]

            const splitedPath = pictureItem.split("/")
            const pictureFileName = splitedPath[splitedPath.length - 1]
            const splitedFileName = pictureFileName.split(".")
            const pictureExtension = splitedFileName[splitedFileName.length - 1]

            // Check if filename is already been used and rename
            let destinyFilePath = `${fullPathPicture}/${pictureFileName}`
            if (await RNFS.exists(destinyFilePath)) {
                do {
                    destinyFilePath = `${fullPathPicture}/${getDateTime("-", "-", true)}.${pictureExtension}`
                } while (await RNFS.exists(destinyFilePath))
                importedDocument[documentItemIndex].pictureList[pictureItemIndex] = destinyFilePath
            }

            try {
                await RNFS.moveFile(`${fullPathTemporaryExported}/${pictureFileName}`, destinyFilePath)
            } catch (error) {
                // Remove ids from imported document when an error is thrown
                importedDocument.forEach(async (item: Document) => {
                    const documentId = await readDocumentId()
                    documentId.splice(documentId.indexOf(item.id), 1)
                    await writeDocumentId(documentId)
                })

                log("ERROR", `Erro movendo imagens da pasta temporária de exportação para pasta de imagens durante importação. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro",
                    "Erro desconhecido ao importar documentos. Processo interrompido"
                )
                return false
            }
        }
    }

    // Write imported document
    const document = await readDocument()
    const newDocument = [...importedDocument, ...document]
    await writeDocument(newDocument)

    // Clear temporary files used on this import
    try {
        await RNFS.unlink(`${fullPathTemporaryExported}/index.txt`)
    } catch (error) {
        log("ERROR", `Erro apagando índice depois de importar documentos. Mensagem: "${error}"`)
    }

    // Warn import has finished
    ToastAndroid.show("Documentos importados", 10)
    return true
}


export async function mergeDocument(ids: Array<number>) {
    const document = await readDocument()

    if (ids.length === 1) {
        Alert.alert(
            "Aviso",
            "Selecione outro documento para combiná-los"
        )
        return
    }

    const mainDocument = document.find((item) => {
        return item.id === ids[0]
    })

    if (!mainDocument) {
        log("ERROR", `document-handler mergeDocument - Erro combinando documentos, "mainDocument = ${mainDocument}"`)
        Alert.alert(
            "Erro",
            "Erro desconhecido ao unir documentos"
        )
        return
    }

    const idsToDelete = []

    for (let x = 0; x < document.length; x++) {
        const documentItem = document[x]
        if (ids.includes(documentItem.id)) {
            if (documentItem.id === ids[0]) {
                continue
            }

            idsToDelete.push(documentItem.id)
            for (let y = 0; y < documentItem.pictureList.length; y++) {
                const pictureItem = documentItem.pictureList[y]
                mainDocument.pictureList.push(pictureItem)
            }
        }
    }

    await deleteDocument(idsToDelete, false)

    await saveEditedDocument(mainDocument, mainDocument.name, mainDocument.pictureList)
}

export async function duplicateDocument(ids: Array<number>) {
    const document = await readDocument()

    const documentToDuplicate = document.filter((item: Document) => {
        if (ids.includes(item.id)) {
            return true
        }
        return false
    })

    for (let x = 0; x < documentToDuplicate.length; x++) {
        const documentItem = documentToDuplicate[x]
        const duplicatedPictureList: Array<string> = []
        for (let y = 0; y < documentItem.pictureList.length; y++) {
            const pictureItem = documentItem.pictureList[y]
            const newPicturePath = await getNewPicturePath(pictureItem)
            duplicatedPictureList.push(newPicturePath)
            try {
                await RNFS.copyFile(pictureItem, newPicturePath)
            } catch (error) {
                log("ERROR", `document-handler duplicateDocument - Erro copiando imagens ao duplicar documento. Mensagem: "${error}"`)
                Alert.alert(
                    "Erro",
                    "Erro duplicando documento"
                )
                throw error
            }
        }

        const newDocument = await createDocument(documentItem.name, duplicatedPictureList)
        document.unshift(newDocument)
    }

    await writeDocument(document)
}


function getFileExtension(path: string): string {
    let splittedFilePath: Array<string> = [path]
    if (path.includes("/")) {
        splittedFilePath = path.split("/")
    }

    const splittedFileName = splittedFilePath[splittedFilePath.length - 1].split(".")
    return splittedFileName[splittedFileName.length - 1]
}

async function getNewPicturePath(path: string): Promise<string> {
    const date = getDateTime("", "", true)
    const fileExtension = getFileExtension(path)

    let newPath = `${fullPathPicture}/${date}.${fileExtension}`
    let counter = 0
    while (await RNFS.exists(newPath)) {
        newPath = `${fullPathPicture}/${date} - ${counter}.${fileExtension}`
        counter += 1
    }

    return newPath
}

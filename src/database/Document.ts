import RNFS from "react-native-fs"
import "react-native-get-random-values"
import SQLite from "react-native-sqlite-storage"
import { unzip } from "react-native-zip-archive"
import { v4 as uuid4 } from "uuid"

import { globalAppDatabase, openTemporaryDatabase } from "."
import { exportDatabaseFileName, exportDatabaseFullPath, fullPathExported, fullPathPicture, fullPathTemporaryExported, fullPathTemporaryImported } from "../services/constant"
import { getDateTime } from "../services/date"
import { getFileExtension } from "../services/document"
import { exportDocumentService, movePicturesService } from "../services/document-service"
import { createTemporaryImportedFolder } from "../services/folder-handler"
import { DocumentForList, DocumentPicture, SimpleDocument } from "../types"


/**
 * Creates the document and document_picture table
 */
export function createDocumentTable(tx: SQLite.Transaction) {
    tx.executeSql(`
        CREATE TABLE IF NOT EXISTS document (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL DEFAULT '',
            lastModificationTimestamp TEXT DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        );
    `)

    tx.executeSql(`
        CREATE TABLE IF NOT EXISTS document_picture (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filePath TEXT NOT NULL UNIQUE,
            fileName TEXT NOT NULL UNIQUE,
            belongsToDocument INTEGER NOT NULL,
            position INTEGER NOT NULL,
            FOREIGN KEY(belongsToDocument) REFERENCES document(id)
        );
    `)
}


/**
 * Get the document to show in a list
 *
 * @returns DocumentForList's array
 */
export async function getDocumentList(): Promise<DocumentForList[]> {
    const [resultSet] = await globalAppDatabase.executeSql(`
        SELECT id, name, lastModificationTimestamp FROM document ORDER BY lastModificationTimestamp DESC;
    `)

    return resultSet.rows.raw()
}


/**
 * Get an specific document
 *
 * @param id of the document to be queried
 *
 * @returns SimpleDocument's object with the document data
 */
export async function getDocument(id: number): Promise<SimpleDocument> {
    const [resultSet] = await globalAppDatabase.executeSql(`
        SELECT name, lastModificationTimestamp FROM document WHERE id = ?;
    `, [id])

    return resultSet.rows.raw()[0]
}


/**
 * Get the pictures of the given document
 *
 * @param documentId id of the document to get the pictures
 *
 * @returns DocumentPicture's array of the document
 */
export async function getDocumentPicture(documentId: number): Promise<DocumentPicture[]> {
    const [resultSet] = await globalAppDatabase.executeSql(`
        SELECT id, filePath, fileName, position FROM document_picture WHERE belongsToDocument = ? ORDER BY position ASC;
    `, [documentId])

    return resultSet.rows.raw()
}


/**
 * Get the picture path in all selected documents
 *
 * @param documentId array with the id of selected documents
 *
 * @returns an string array with the picture path contained in thoose documents
 */
export async function getPicturePathFromDocument(documentId: number[]): Promise<string[]> {
    let documentIdPlaceholder = ""
    for (let i = 0; i < documentId.length; i++) {
        if (i === 0) {
            documentIdPlaceholder += "?"
            continue
        }
        documentIdPlaceholder += ", ?"
    }

    const [resultSet] = await globalAppDatabase.executeSql(`
        SELECT filePath FROM document_picture WHERE belongsToDocument IN (${documentIdPlaceholder});
    `, documentId)

    return resultSet.rows.raw().map((item: { filePath: string }) => item.filePath)
}


/**
 * Insert a new document into the database
 *
 * @param documentName document name string
 * @param pictureList document's DocumentPicture's array
 *
 * @returns operation result set
 */
export function insertDocument(documentName: string, pictureList: DocumentPicture[]): Promise<number> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.transaction(tx => {
            tx.executeSql(`
                INSERT INTO document (name) VALUES (?);
            `, [documentName], (insertDocumentTransaction, insertDocumentResultSet) => {


                let picturesToInsertPlaceholder = ""
                const picturesData: unknown[] = []
                for (let i = 0; i < pictureList.length; i++) {
                    if (i === 0) {
                        picturesToInsertPlaceholder += "?, ?, ?, ?"
                    } else {
                        picturesToInsertPlaceholder += "), (?, ?, ?, ?"
                    }
                    picturesData.push(pictureList[i].filePath)
                    picturesData.push(pictureList[i].fileName)
                    picturesData.push(insertDocumentResultSet.insertId)
                    picturesData.push(pictureList[i].position)
                }


                insertDocumentTransaction.executeSql(`
                    INSERT INTO document_picture (
                        filePath,
                        fileName,
                        belongsToDocument,
                        position
                    ) VALUES (${picturesToInsertPlaceholder});
                `, picturesData, () => resolve(insertDocumentResultSet.insertId))
            })
        }, reject, () => {})
    })
}


/**
 * Update an existing document
 *
 * @param id id of the document to be updated
 * @param documentName current or new document name string
 * @param pictureList current or new document picture list
 *
 * @returns operation result set
 */
export function updateDocument(id: number, documentName: string, pictureList: DocumentPicture[]): Promise<void> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.transaction(tx => {
            tx.executeSql(`
                UPDATE document SET
                    name = ?,
                    lastModificationTimestamp = datetime(CURRENT_TIMESTAMP, 'localtime')
                WHERE id = ?;
            `, [documentName, id])

            for (let i = 0; i < pictureList.length; i++) {
                if (pictureList[i].id) {
                    tx.executeSql(`
                        UPDATE document_picture SET filePath = ?, fileName = ?, position = ? WHERE id = ?;
                    `, [pictureList[i].filePath, pictureList[i].fileName, pictureList[i].position, pictureList[i].id])
                    continue
                }

                tx.executeSql(`
                    INSERT INTO document_picture (filePath, fileName, belongsToDocument, position) VALUES (?, ?, ?, ?);
                `, [pictureList[i].filePath, pictureList[i].fileName, id, pictureList[i].position])
            }
        }, reject, () => resolve())
    })
}


/**
 * Deletes the document with the given id
 *
 * This function only deletes the document from database.
 * File deletion still has to be invoked.
 *
 * @param id array of document id's to delete
 *
 * @returns operation result set
 */
export function deleteDocument(id: number[]): Promise<void> {
    let idToDelete = ""
    for (let i = 0; i < id.length; i++) {
        if (i === 0) {
            idToDelete += "?"
            continue
        }
        idToDelete += ", ?"
    }

    return new Promise((resolve, reject) => {
        globalAppDatabase.transaction(tx => {
            tx.executeSql(`
                DELETE FROM document WHERE id IN (${idToDelete});
            `, id)

            tx.executeSql(`
                DELETE FROM document_picture WHERE belongsToDocument IN (${idToDelete});
            `, id)
        }, reject, () => resolve())
    })
}


/**
 * Deletes the document picture with the given id
 *
 * This function only deletes the document from database.
 * File deletion still has to be invoked.
 *
 * @param id array of id document pictures's id to delete
 *
 * @returns operation result set
 */
export async function deleteDocumentPicture(id: number[]) {
    let idToDelete = ""
    for (let i = 0; i < id.length; i++) {
        if (i === 0) {
            idToDelete += "?"
            continue
        }
        idToDelete += ", ?"
    }

    await globalAppDatabase.executeSql(`
        DELETE FROM document_picture WHERE id IN (${idToDelete});
    `, id)
}


/**
 * Exports all documents or the selected documents when
 * the id is provided.
 *
 * @param id array of document id to export
 */
// TODO use service to export documents
export async function exportDocument(id: number[] = []) {
    // Open database to export
    const exportDb = await openTemporaryDatabase(exportDatabaseFullPath)

    // Create export_document and export_document_picture tables
    await exportDb.transaction(tx => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS export_document (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL DEFAULT '',
                lastModificationTimestamp TEXT DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
            );
        `)

        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS export_document_picture (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fileName TEXT NOT NULL UNIQUE,
                belongsToDocument INTEGER NOT NULL,
                position INTEGER NOT NULL,
                FOREIGN KEY(belongsToDocument) REFERENCES document(id)
            );
        `)
    })

    // Delete all data in export_document and export_document_picture
    await exportDb.transaction(tx => {
        tx.executeSql("DELETE FROM export_document;")

        tx.executeSql("DELETE FROM export_document_picture;")
    })

    // Close database to export before attach it
    await exportDb.close()


    // Attach databases
    const exportDatabaseAlias = "export_database"
    await globalAppDatabase.attach(exportDatabaseFullPath, exportDatabaseAlias)

    // Transfer all data to export from app database to export database
    await globalAppDatabase.transaction(tx => {
        let documentIdPlaceholder = ""
        let documentWherePlaceholder = ""
        let documentPictureWherePlaceholder = ""

        if (id.length > 0) {
            for (let i = 0; i < id.length; i++) {
                if (i === 0) {
                    documentIdPlaceholder += "?"
                    continue
                }
                documentIdPlaceholder += ", ?"
            }

            documentWherePlaceholder = ` WHERE id IN (${documentIdPlaceholder})`
            documentPictureWherePlaceholder = ` WHERE belongsToDocument IN (${documentIdPlaceholder})`
        }

        tx.executeSql(`
            INSERT INTO ${exportDatabaseAlias}.export_document (
                id,
                name,
                lastModificationTimestamp
            ) SELECT
                id,
                name,
                lastModificationTimestamp
            FROM document${documentWherePlaceholder};
        `, (id.length > 0) ? id : undefined)

        tx.executeSql(`
            INSERT INTO ${exportDatabaseAlias}.export_document_picture (
                id,
                fileName,
                belongsToDocument,
                position
            ) SELECT
                id,
                fileName,
                belongsToDocument,
                position
            FROM document_picture${documentPictureWherePlaceholder};
        `, (id.length > 0) ? id : undefined)
    })

    // Select the file names of all pictures to export
    const [picturesToExportResultSet] = await globalAppDatabase.executeSql(`
        SELECT fileName FROM ${exportDatabaseAlias}.export_document_picture;
    `)

    // Prepare an array with all the picture paths to export
    const picturesToCopy: string[] = []
    for (let i = 0; i < picturesToExportResultSet.rows.length; i++) {
        const fromFileName = picturesToExportResultSet.rows.item(i).fileName
        picturesToCopy.push(`${fullPathPicture}/${fromFileName}`)
    }

    // Create the name of exported document zip file
    const dateTime = getDateTime()
    const pathZipTo = `${fullPathTemporaryExported}/DocScan - Documento exportado ${dateTime}.zip`
    const pathExportedDocument = `${fullPathExported}/DocScan - Documento exportado ${dateTime}.zip`

    // Run the service to export document
    exportDocumentService(picturesToCopy, exportDatabaseFullPath, pathZipTo, pathExportedDocument)
}


/**
 * Import the documents in the exported document in path
 *
 * @param path string path to the exported document
 * file to be imported
 */
// TODO use service to import documents
export async function importDocument(path: string) {


    // Clear temporary imported folder
    await RNFS.unlink(fullPathTemporaryImported)

    // Recreate temporary imported folder
    await createTemporaryImportedFolder()

    // Unzip document
    await unzip(path, fullPathTemporaryImported)


    // Attach database
    const importDbPath = `${fullPathTemporaryImported}/${exportDatabaseFileName}`
    const importDatabaseAlias = "import_database"
    await globalAppDatabase.attach(importDbPath, importDatabaseAlias)


    // Get all id and fileName to rename in export_document_picture
    const [pictureToRenameResultSet] = await globalAppDatabase.executeSql(`
        SELECT id, fileName
        FROM ${importDatabaseAlias}.export_document_picture
        WHERE fileName IN (
            SELECT fileName FROM document_picture
        );
    `)

    // Rename all duplicated fileName in export_document_picture
    const renamedPicturesToSave: {id: number; fileName: string}[] = []
    for (let i = 0; i < pictureToRenameResultSet.rows.length; i++) {
        const pictureId: number = pictureToRenameResultSet.rows.item(i).id
        const pictureFileName: string = pictureToRenameResultSet.rows.item(i).fileName
        const pictureFileExtension = getFileExtension(pictureFileName)

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const newUniqueName = uuid4()
            const newFileName = `${newUniqueName}.${pictureFileExtension}`

            const [matchingNamesResultSet] = await globalAppDatabase.executeSql(`
                SELECT id FROM document_picture WHERE fileName LIKE ?;
            `, [`%${newFileName}%`])

            if (matchingNamesResultSet.rows.length === 0) {
                await RNFS.moveFile(
                    `${fullPathTemporaryImported}/${pictureFileName}`,
                    `${fullPathTemporaryImported}/${newFileName}`
                )
                renamedPicturesToSave.push({
                    id: pictureId,
                    fileName: newFileName,
                })
                break
            }
        }
    }

    // Save the renamed pictures to export_document_picture database
    await globalAppDatabase.transaction(tx => {
        renamedPicturesToSave.forEach(item => {
            tx.executeSql(`
                UPDATE ${importDatabaseAlias}.export_document_picture
                SET fileName = ?
                WHERE id = ?;
            `, [item.fileName, item.id])
        })
    })


    // Get the id of documents to import
    const [selectIdResultSet] = await globalAppDatabase.executeSql(`
        SELECT id FROM ${importDatabaseAlias}.export_document;
    `)
    const documentIdToImport = selectIdResultSet.rows.raw().map((item: {id: number}) => item.id)

    // Transfer data from export database to app database
    await globalAppDatabase.transaction(tx => {
        for (let i = 0; i < documentIdToImport.length; i++) {
            const id = documentIdToImport[i]

            // Transfer all data from export_document to document
            tx.executeSql(`
                INSERT INTO document (name)
                    SELECT name
                    FROM ${importDatabaseAlias}.export_document
                    WHERE id = ?;
            `, [id], (transaction, resultSet) => {
                // Transfer all data from export_document_picture to document_picture
                transaction.executeSql(`
                    INSERT INTO document_picture (
                        fileName,
                        filePath,
                        belongsToDocument,
                        position
                    ) SELECT
                        fileName,
                        ? || fileName AS filePath,
                        ? AS belongsToDocument,
                        position
                    FROM ${importDatabaseAlias}.export_document_picture WHERE belongsToDocument = ?;
                `, [`${fullPathPicture}/`, resultSet.insertId, id])
            })
        }
    })

    // Get all picture's fileName
    const [completePicturePathResultSet] = await globalAppDatabase.executeSql(`
        SELECT fileName FROM ${importDatabaseAlias}.export_document_picture;
    `)

    // Prepare the array to move pictures from temporary folder to pictures folder
    const picturePathToMove: string[] = []
    completePicturePathResultSet.rows.raw().forEach(({ fileName }: { fileName: string }) => {
        picturePathToMove.push(`${fullPathTemporaryImported}/${fileName}`)
        picturePathToMove.push(`${fullPathPicture}/${fileName}`)
    })

    // Delete export database in temporary folder
    await RNFS.unlink(`${fullPathTemporaryImported}/${exportDatabaseFileName}`)

    // Start the service to move picture's files
    movePicturesService(picturePathToMove)
}


/**
 * TODO
 */
// TODO implement
export function duplicateDocument(id: number[]): Promise<void> {
    return new Promise((resolve, reject) => resolve())
}


/**
 * TODO
 */
// TODO implement
export function mergeDocument(id: number[]): Promise<void> {
    return new Promise((resolve, reject) => resolve())
}


/**
 * Checks if already exists an picture with the same fileName
 * as the given one
 *
 * @param fileName string of the fileName to be checked
 *
 * @returns boolean indicating if the fileName already is
 * in the database
 */
export async function pictureNameExists(fileName: string): Promise<boolean> {
    const [resultSet] = await globalAppDatabase.executeSql(`
        SELECT fileName FROM document_picture WHERE fileName = ?;
    `, [fileName])

    if (resultSet.rows.length > 0) {
        return true
    }
    return false
}

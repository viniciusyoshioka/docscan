import SQLite from "react-native-sqlite-storage"

import { globalAppDatabase, openTemporaryDatabase } from "."
import { exportDatabaseFullPath, fullPathExported, fullPathPicture, fullPathTemporaryExported } from "../services/constant"
import { getDateTime } from "../services/date"
import { exportDocumentService } from "../services/document-service"
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
export function getDocumentList(): Promise<DocumentForList[]> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT id, name, lastModificationTimestamp FROM document ORDER BY lastModificationTimestamp DESC;
        `)
            .then(([resultSet]) => {
                resolve(resultSet.rows.raw())
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Get an specific document
 * 
 * @param id of the document to be queried
 * 
 * @returns SimpleDocument's object with the document data
 */
export function getDocument(id: number): Promise<SimpleDocument> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT name, lastModificationTimestamp FROM document WHERE id = ?;
        `, [id])
            .then(([resultSet]) => {
                resolve(resultSet.rows.raw()[0])
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Get the pictures of the given document
 * 
 * @param documentId id of the document to get the pictures
 * 
 * @returns DocumentPicture's array of the document
 */
export function getDocumentPicture(documentId: number): Promise<DocumentPicture[]> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT id, filePath, fileName, position FROM document_picture WHERE belongsToDocument = ? ORDER BY position ASC;
        `, [documentId])
            .then(([resultSet]) => {
                resolve(resultSet.rows.raw())
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Get the picture path in all selected documents
 * 
 * @param documentId array with the id of selected documents
 * 
 * @returns an string array with the picture path contained in thoose documents
 */
export function getPicturePathFromDocument(documentId: number[]): Promise<string[]> {
    return new Promise((resolve, reject) => {

        let documentIdPlaceholder = ""
        if (documentId.length >= 1) {
            documentIdPlaceholder += "?"
        }
        for (let i = 1; i < documentId.length; i++) {
            documentIdPlaceholder += ", ?"
        }

        globalAppDatabase.executeSql(`
            SELECT filePath FROM document_picture WHERE belongsToDocument IN (${documentIdPlaceholder});
        `, documentId)
            .then(([resultSet]) => {
                const filePath = resultSet.rows.raw()
                    .map((item: { filePath: string }) => {
                        return item.filePath
                    })
                resolve(filePath)
            })
            .catch(reject)
    })
}


/**
 * Insert a new document in the database
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
            `, [documentName], (_, insertDocumentResultSet) => {
                let picturesToInsertPlaceholder = ""
                const picturesData: unknown[] = []

                if (pictureList.length >= 1) {
                    picturesToInsertPlaceholder += "?, ?, ?, ?"
                    picturesData.push(pictureList[0].filePath)
                    picturesData.push(pictureList[0].fileName)
                    picturesData.push(insertDocumentResultSet.insertId)
                    picturesData.push(pictureList[0].position)
                }
                for (let i = 1; i < pictureList.length; i++) {
                    picturesToInsertPlaceholder += "), (?, ?, ?, ?"
                    picturesData.push(pictureList[i].filePath)
                    picturesData.push(pictureList[i].fileName)
                    picturesData.push(insertDocumentResultSet.insertId)
                    picturesData.push(pictureList[i].position)
                }

                tx.executeSql(`
                    INSERT INTO document_picture (filePath, fileName, belongsToDocument, position) VALUES (${picturesToInsertPlaceholder});
                `, picturesData, () => {
                    resolve(insertDocumentResultSet.insertId)
                })
            })
        }, (error) => {
            reject(error)
        }, () => {})
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
export function updateDocument(
    id: number,
    documentName: string,
    pictureList: DocumentPicture[]
): Promise<void> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.transaction(tx => {
            tx.executeSql(`
                UPDATE document SET name = ?, lastModificationTimestamp = datetime(CURRENT_TIMESTAMP, 'localtime') WHERE id = ?;
            `, [documentName, id])

            for (let i = 0; i < pictureList.length; i++) {
                if (pictureList[i].id) {
                    tx.executeSql(`
                        UPDATE document_picture SET filePath = ?, fileName = ?, position = ? WHERE id = ?;
                    `, [pictureList[i].filePath, pictureList[i].fileName, pictureList[i].position, pictureList[i].id])
                } else {
                    tx.executeSql(`
                        INSERT INTO document_picture (filePath, fileName, belongsToDocument, position) VALUES (?, ?, ?, ?);
                    `, [pictureList[i].filePath, pictureList[i].fileName, id, pictureList[i].position])
                }
            }
        }, (error) => {
            reject(error)
        }, () => {
            resolve()
        })
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
    return new Promise((resolve, reject) => {

        let idToDelete = ""
        if (id.length >= 1) {
            idToDelete += "?"
        }
        for (let i = 1; i < id.length; i++) {
            idToDelete += ", ?"
        }

        globalAppDatabase.transaction(tx => {
            tx.executeSql(`
                DELETE FROM document WHERE id IN (${idToDelete});
            `, id)

            tx.executeSql(`
                DELETE FROM document_picture WHERE belongsToDocument IN (${idToDelete});
            `, id)
        }, (error) => {
            reject(error)
        }, () =>{
            resolve()
        })
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
export function deleteDocumentPicture(id: number[]): Promise<SQLite.ResultSet> {
    return new Promise((resolve, reject) => {

        let idToDelete = ""
        if (id.length >= 1) {
            idToDelete += "?"
        }
        for (let i = 1; i < id.length; i++) {
            idToDelete += ", ?"
        }

        globalAppDatabase.executeSql(`
            DELETE FROM document_picture WHERE id IN (${idToDelete});
        `, id)
            .then(([resultSet]) => {
                resolve(resultSet)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 * Exports all documents or the selected documents when
 * the id is provided.
 * 
 * @param id array of document id to export
 */
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
        tx.executeSql(`
            DELETE FROM export_document;
        `)

        tx.executeSql(`
            DELETE FROM export_document_picture;
        `)
    })

    // Attach databases
    const exportDatabaseAlias = "export_database"
    await globalAppDatabase.attach(exportDatabaseFullPath, exportDatabaseAlias)

    // Transfer all data to export from app database to export database
    await globalAppDatabase.transaction(tx => {
        let documentIdPlaceholder = ""
        let documentWherePlaceholder = ""
        let documentPictureWherePlaceholder = ""

        if (id.length > 0) {
            if (id.length >= 1) {
                documentIdPlaceholder += "?"
            }
            for (let i = 1; i < id.length; i++) {
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
    const dateTime = getDateTime("-", "-", true)
    const pathZipTo = `${fullPathTemporaryExported}/DocScan - Documento exportado ${dateTime}.zip`
    const pathExportedDocument = `${fullPathExported}/DocScan - Documento exportado ${dateTime}.zip`

    // Run the service to export document
    exportDocumentService(picturesToCopy, exportDatabaseFullPath, pathZipTo, pathExportedDocument)
}

/**
 * TODO
 */
export async function importDocument(path: string) {
    // TODO
}

/**
 * TODO
 */
export function duplicateDocument(id: number[]): Promise<void> {
    return new Promise((resolve, reject) => {})
}

/**
 * TODO
 */
export function mergeDocument(id: number[]): Promise<void> {
    return new Promise((resolve, reject) => {})
}

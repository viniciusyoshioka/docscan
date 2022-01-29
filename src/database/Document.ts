import SQLite from "react-native-sqlite-storage"

import { DocumentForList, DocumentPicture, SimpleDocument } from "../types"
import { globalAppDatabase } from "."


/**
 * Creates the document and document_picture table
 */
export function createDocumentTable(): Promise<void> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            CREATE TABLE IF NOT EXISTS document (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL DEFAULT '',
                lastModificationTimestamp TEXT DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
            );
        `)
            .then(async () => {
                await globalAppDatabase.executeSql(`
                    CREATE TABLE IF NOT EXISTS document_picture (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        filepath TEXT NOT NULL,
                        belongsToDocument INTEGER NOT NULL,
                        position INTEGER NOT NULL,
                        FOREIGN KEY(belongsToDocument) REFERENCES document(id)
                    );
                `)
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
    })
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
            SELECT id, filepath, position FROM document_picture WHERE belongsToDocument = ? ORDER BY position ASC;
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
            SELECT filepath FROM document_picture WHERE belongsToDocument IN (${documentIdPlaceholder});
        `, documentId)
            .then(([resultSet]) => {
                const filepath = resultSet.rows.raw()
                    .map((item: {filepath: string}) => {
                        return item.filepath
                    })
                resolve(filepath)
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
export function insertDocument(documentName: string, pictureList: DocumentPicture[]): Promise<SQLite.ResultSet[]> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            INSERT INTO document (name) VALUES (?);
        `, [documentName])
            .then(async ([documentResultSet]) => {
                let picturesToInsert = ""
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const picturesData: any[] = []

                if (pictureList.length >= 1) {
                    picturesToInsert += "?, ?, ?"
                    picturesData.push(pictureList[0].filepath)
                    picturesData.push(documentResultSet.insertId)
                    picturesData.push(pictureList[0].position)
                }
                for (let i = 1; i < pictureList.length; i++) {
                    picturesToInsert += "), (?, ?, ?"
                    picturesData.push(pictureList[i].filepath)
                    picturesData.push(documentResultSet.insertId)
                    picturesData.push(pictureList[i].position)
                }

                const [documentPictureResultSet] = await globalAppDatabase.executeSql(`
                    INSERT INTO document_picture (filepath, belongsToDocument, position) VALUES (${picturesToInsert});
                `, picturesData)
                resolve([documentResultSet, documentPictureResultSet])
            })
            .catch((error) => {
                reject(error)
            })
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
): Promise<SQLite.ResultSet> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            UPDATE document SET name = ?, lastModificationTimestamp = datetime(CURRENT_TIMESTAMP, 'localtime') WHERE id = ?;
        `, [documentName, id])
            .then(async ([documentResultSet]) => {
                for (let i = 0; i < pictureList.length; i++) {
                    if (pictureList[i].id) {
                        await globalAppDatabase.executeSql(`
                            UPDATE document_picture SET filepath = ?, position = ? WHERE id = ?;
                        `, [pictureList[i].filepath, pictureList[i].position, pictureList[i].id])
                    } else {
                        await globalAppDatabase.executeSql(`
                            INSERT INTO document_picture (filepath, belongsToDocument, position) VALUES (?, ?, ?);
                        `, [pictureList[i].filepath, id, pictureList[i].position])
                    }
                }
                resolve(documentResultSet)
            })
            .catch((error) => {
                reject(error)
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
export function deleteDocument(id: number[]): Promise<SQLite.ResultSet[]> {
    return new Promise((resolve, reject) => {

        let idToDelete = ""
        if (id.length >= 1) {
            idToDelete += "?"
        }
        for (let i = 1; i < id.length; i++) {
            idToDelete += ", ?"
        }

        globalAppDatabase.executeSql(`
            DELETE FROM document WHERE id IN (${idToDelete});
        `, id)
            .then(async ([documentResultSet]) => {
                const [documentPictureResultSet] = await globalAppDatabase.executeSql(`
                    DELETE FROM document_picture WHERE belongsToDocument IN (${idToDelete});
                `, id)
                resolve([documentResultSet, documentPictureResultSet])
            })
            .catch((error) => {
                reject(error)
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
 * TODO
 */
export function exportDocument(id: number[] = []): Promise<null> {
    return new Promise((resolve, reject) => {})
}

/**
 * TODO
 */
export function importDocument(path: string): Promise<null> {
    return new Promise((resolve, reject) => {})
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

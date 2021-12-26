/* eslint-disable @typescript-eslint/no-explicit-any */
import SQLite from "react-native-sqlite-storage"

import { globalAppDatabase } from "."
import { DocumentForList, DocumentPicture, SimpleDocument } from "../types"


export function createDocumentTable(): Promise<SQLite.ResultSet[]> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            CREATE TABLE IF NOT EXISTS document (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL DEFAULT '',
                lastModificationTimestamp TEXT DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
            );
        `)
            .then(async ([documentTableResultSet]) => {
                const [documentPictureTableResultSet] = await globalAppDatabase.executeSql(`
                    CREATE TABLE IF NOT EXISTS document_picture (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        filepath TEXT NOT NULL,
                        belongsToDocument INTEGER NOT NULL,
                        position INTEGER NOT NULL,
                        FOREIGN KEY(belongsToDocument) REFERENCES document(id)
                    );
                `)
                resolve([documentTableResultSet, documentPictureTableResultSet])
            })
            .catch((error) => {
                reject(error)
            })
    })
}


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


export function getDocument(id: number): Promise<SimpleDocument> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT name FROM document WHERE id = ?;
        `, [id])
            .then(([resultSet]) => {
                resolve(resultSet.rows.raw()[0])
            })
            .catch((error) => {
                reject(error)
            })
    })
}


export function getDocumentPictures(id: number): Promise<DocumentPicture> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT id, filepath, position FROM document_picture WHERE belongsToDocument = ? ORDER BY position ASC;
        `, [id])
            .then(([resultSet]) => {
                console.log("getDocumentPictures", resultSet.rows.raw())
                resolve(resultSet.rows.raw() as unknown as DocumentPicture)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


export function insertDocument(documentName: string, pictureList: string[]): Promise<SQLite.ResultSet[]> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            INSERT INTO document (name) VALUES (?);
        `, [documentName])
            .then(async ([documentResultSet]) => {
                let picturesToInsert = ""
                const picturesData: any[] = []

                if (pictureList.length >= 1) {
                    picturesToInsert += "?, ?, ?"
                    picturesData.push(pictureList[0])
                    picturesData.push(documentResultSet.insertId)
                    picturesData.push(0)
                }
                for (let i = 1; i < pictureList.length; i++) {
                    picturesToInsert += "), (?, ?, ?"
                    picturesData.push(pictureList[i])
                    picturesData.push(documentResultSet.insertId)
                    picturesData.push(i)
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


export function updateDocument(
    id: number,
    documentName: string,
    pictureList: DocumentPicture[]
): Promise<SQLite.ResultSet> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            UPDATE document SET name = ?, timestamp = datetime(CURRENT_TIMESTAMP, 'localtime') WHERE id = ?;
        `, [documentName, id])
            .then(async ([resultSet]) => {
                for (let i = 0; i < pictureList.length; i++) {
                    await globalAppDatabase.executeSql(`
                        UPDATE document_picture SET filepath = ?, position = ? WHERE id = ?;
                    `, [pictureList[i].filepath, i, pictureList[i].id])
                }
                resolve(resultSet)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


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


export function deleteDocumentPicture(id: number[]) {
    return new Promise((resolve, reject) => {

        let idToDelete = ""
        if (id.length >= 1) {
            idToDelete += "?"
        }
        for (let i = 1; i < id.length; i++) {
            idToDelete += ", ?"
        }

        globalAppDatabase.executeSql(`
            DELETE FROM document_picture WHERE id in (${idToDelete});
        `, id)
            .then(([resultSet]) => {
                resolve(resultSet)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


export function exportDocument(id: number[] = []): Promise<null> {
    return new Promise((resolve, reject) => {})
}


export function importDocument(path: string): Promise<null> {
    return new Promise((resolve, reject) => {})
}


export function duplicateDocument(id: number[]): Promise<void> {
    return new Promise((resolve, reject) => {})
}


export function mergeDocument(id: number[]): Promise<void> {
    return new Promise((resolve, reject) => {})
}

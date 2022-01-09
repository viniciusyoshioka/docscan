import SQLite from "react-native-sqlite-storage"

import { globalLogDatabase } from "."


/**
 * Create the log table to store logs
 * 
 * @returns SQLite.ResultSet of the operation
 */
export function createLogTable(): Promise<void> {
    return new Promise((resolve, reject) => {
        globalLogDatabase.executeSql(`
            CREATE TABLE IF NOT EXISTS log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT,
                message TEXT,
                timestamp TEXT DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
            );
        `)
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Insert the log into the database
 * 
 * @param code string with the severity of the log
 * @param message string of the log message
 * 
 * @returns SQLite.ResultSet of the operation
 */
export function insertLog(code: string, message: string): Promise<SQLite.ResultSet> {
    return new Promise((resolve, reject) => {
        globalLogDatabase.executeSql(`
            INSERT INTO log (code, message) VALUES (?, ?);
        `, [code, message])
            .then(([resultSet]) => {
                resolve(resultSet)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

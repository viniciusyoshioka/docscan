import SQLite from "react-native-sqlite-storage"

import { globalLogDatabase } from "."


/**
 * Create the log table to store logs
 *
 * @returns SQLite.ResultSet of the operation
 */
export function createLogTable(tx: SQLite.Transaction) {
    tx.executeSql(`
        CREATE TABLE IF NOT EXISTS log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT,
            message TEXT,
            timestamp TEXT DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        );
    `)
}


/**
 * Insert the log into the database
 *
 * @param code string with the severity of the log
 * @param message string of the log message
 */
export async function insertLog(code: string, message: string) {
    await globalLogDatabase.executeSql(`
        INSERT INTO log (code, message) VALUES (?, ?);
    `, [code, message])
}

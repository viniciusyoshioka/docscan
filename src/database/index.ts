import SQLite from "react-native-sqlite-storage"

import { appDatabaseFullPath, logDatabaseFullPath } from "../services/constant"


export * as DocumentDatabase from "./Document"
export * as LogDatabase from "./Log"
export * as SettingsDatabase from "./Settings"


/**
 * Global app database instance
 */
export let globalAppDatabase: SQLite.SQLiteDatabase

/**
 * Global log database instance
 */
export let globalLogDatabase: SQLite.SQLiteDatabase


/**
 * Sets the global app database
 *
 * @param database the database instance
 * to be set as global app database
 */
export function setGlobalAppDatabase(database: SQLite.SQLiteDatabase) {
    globalAppDatabase = database
}


/**
 * Sets the global log database
 *
 * @param database the database instance
 * to be set as global log database
 */
export function setGlobalLogDatabase(database: SQLite.SQLiteDatabase) {
    globalLogDatabase = database
}


/**
 * Opens app database
 *
 * @returns the instance of the opened database
 */
export async function openAppDatabase(): Promise<SQLite.SQLiteDatabase> {
    return await SQLite.openDatabase({
        name: appDatabaseFullPath,
        location: "default"
    })
}


/**
 * Opens log database
 *
 * @returns the instance of the opened database
 */
export async function openLogDatabase(): Promise<SQLite.SQLiteDatabase> {
    return await SQLite.openDatabase({
        name: logDatabaseFullPath,
        location: "default"
    })
}


/**
 * Opens a temporary database
 *
 * @param databaseFilePath string of the name of the database file
 *
 * @returns the instance of the opened database
 */
export async function openTemporaryDatabase(databaseFilePath: string): Promise<SQLite.SQLiteDatabase> {
    return await SQLite.openDatabase({
        name: databaseFilePath,
        location: "default"
    })
}

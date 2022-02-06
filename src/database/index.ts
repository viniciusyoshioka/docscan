import SQLite from "react-native-sqlite-storage"

import { appDatabaseFullPath, logDatabaseFullPath } from "../services/constant"


import * as DocumentDatabase from "./Document"
export { DocumentDatabase }


import * as LogDatabase from "./Log"
export { LogDatabase }


import * as SettingsDatabase from "./Settings"
export { SettingsDatabase }


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
export function openAppDatabase(): Promise<SQLite.SQLiteDatabase> {
    return new Promise((resolve, reject) => {
        SQLite.openDatabase({
            name: appDatabaseFullPath,
            location: "default"
        })
            .then((db) => {
                resolve(db)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Opens log database
 * 
 * @returns the instance of the opened database
 */
export function openLogDatabase(): Promise<SQLite.SQLiteDatabase> {
    return new Promise((resolve, reject) => {
        SQLite.openDatabase({
            name: logDatabaseFullPath,
            location: "default"
        })
            .then((db) => {
                resolve(db)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Opens a temporary database
 * 
 * @param databaseFilePath string of the name of the database file
 * 
 * @returns the instance of the opened database
 */
export function openTemporaryDatabase(databaseFilePath: string): Promise<SQLite.SQLiteDatabase> {
    return new Promise((resolve, reject) => {
        SQLite.openDatabase({
            name: databaseFilePath,
            location: "default"
        })
            .then((db) => {
                resolve(db)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

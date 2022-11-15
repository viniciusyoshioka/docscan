import SQLite from "react-native-sqlite-storage"

import { globalAppDatabase } from "."
import { cameraFlashDefault, cameraIdDefault, cameraRatioDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "../services/settings"
import { themeDefault } from "../services/theme"
import { SettingsKey, SettingsObject } from "../types"


/**
 * Create settings table it not exists and inserts the
 * default settings object
 */
export function createSettingsTable(tx: SQLite.Transaction) {
    tx.executeSql(`
        SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'settings';
    `, undefined, (_, selectResultSet) => {
        if (selectResultSet.rows.length === 0) {
            tx.executeSql(`
                CREATE TABLE settings (
                    key TEXT,
                    value TEXT,
                    PRIMARY KEY("key")
                );
            `)         

            tx.executeSql(`
                INSERT INTO settings 
                    (key, value) 
                VALUES 
                    ('theme', ?),
                    ('cameraFlash', ?),
                    ('cameraWhiteBalance', ?),
                    ('cameraType', ?),
                    ('cameraId', ?),
                    ('cameraRatio', ?);
            `, [
                themeDefault,
                cameraFlashDefault,
                cameraWhiteBalanceDefault,
                cameraTypeDefault,
                cameraIdDefault,
                cameraRatioDefault
            ])
        }
    })
}


/**
 * Get all settings
 * 
 * @returns SettingsObject
 */
export function getSettings(): Promise<SettingsObject> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT * FROM settings;
        `)
            .then(([resultSet]) => {
                const settings = {} as SettingsObject
                resultSet.rows.raw().forEach((item: {key: SettingsKey, value: never}) => {
                    settings[item.key] = item.value
                })
                // console.log("getSettings settings", settings)
                resolve(settings)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Get the setting of the given key
 * 
 * @param key string of type SettingsKey to get its settings
 * 
 * @returns the setting of the given key
 */
export function getSettingKey<K extends SettingsKey>(key: K): Promise<SettingsObject[K]> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT value FROM settings WHERE key = ?;
        `, [key])
            .then(([resultSet]) => {
                // console.log("getSettingKey settings", resultSet.rows.raw())
                resolve(resultSet.rows.raw()[0].value)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Adds a new setting into the database
 * 
 * @param key SettingsKey string to add
 * @param value the value to add for the given SettingsKey
 * 
 * @returns the operation's result set
 */
export function insertSettings<K extends SettingsKey>(key: K, value: SettingsObject[K]): Promise<SQLite.ResultSet> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            INSERT INTO settings (key, value) VALUES (?, ?);
        `, [key, value])
            .then(([resultSet]) => {
                resolve(resultSet)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Updates the value of an existin setting
 * 
 * @param key SettingsKey string to update
 * @param value the new value for the given SettingsKey
 * 
 * @returns the operation's result set
 */
export function updateSettings<K extends SettingsKey>(key: K, value: SettingsObject[K]): Promise<SQLite.ResultSet> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            UPDATE settings SET value = ? WHERE key = ?;
        `, [value, key])
            .then(([resultSet]) => {
                resolve(resultSet)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


/**
 * Deletes the settings with the given keys
 * 
 * @param keys SettingsKey's array to be deleted
 * 
 * @returns the operation's result set
 */
export function deleteSettings(keys: SettingsKey[]): Promise<SQLite.ResultSet> {
    return new Promise((resolve, reject) => {

        let keysToDelete = ""
        if (keys.length >= 1) {
            keysToDelete += "?"
        }
        for (let i = 1; i < keys.length; i++) {
            keysToDelete += ", ?"
        }

        globalAppDatabase.executeSql(`
            DELETE FROM settings WHERE key IN (${keysToDelete});
        `, keys)
            .then(([resultSet]) => {
                resolve(resultSet)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

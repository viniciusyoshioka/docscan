import SQLite from "react-native-sqlite-storage"

import { globalAppDatabase } from "."
import { cameraFlashDefault, cameraIdDefault, cameraRatioDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "../services/settings"
import { themeDefault } from "../theme"
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
export async function getSettings(): Promise<SettingsObject> {
    const [resultSet] = await globalAppDatabase.executeSql(`
        SELECT * FROM settings;
    `)

    const settings = {} as SettingsObject
    resultSet.rows.raw().forEach((item: {key: SettingsKey, value: never}) => {
        settings[item.key] = item.value
    })
    return settings
}


/**
 * Get the setting of the given key
 *
 * @param key string of type SettingsKey to get its settings
 *
 * @returns the setting of the given key
 */
export async function getSettingKey<K extends SettingsKey>(key: K): Promise<SettingsObject[K]> {
    const [resultSet] = await globalAppDatabase.executeSql(`
        SELECT value FROM settings WHERE key = ?;
    `, [key])

    return resultSet.rows.raw()[0].value
}


/**
 * Adds a new setting into the database
 *
 * @param key SettingsKey string to add
 * @param value the value to add for the given SettingsKey
 *
 * @returns the operation's result set
 */
export async function insertSettings<K extends SettingsKey>(key: K, value: SettingsObject[K]) {
    await globalAppDatabase.executeSql(`
        INSERT INTO settings (key, value) VALUES (?, ?);
    `, [key, value])
}


/**
 * Updates the value of an existin setting
 *
 * @param key SettingsKey string to update
 * @param value the new value for the given SettingsKey
 *
 * @returns the operation's result set
 */
export async function updateSettings<K extends SettingsKey>(key: K, value: SettingsObject[K]) {
    await globalAppDatabase.executeSql(`
        UPDATE settings SET value = ? WHERE key = ?;
    `, [value, key])
}


/**
 * Deletes the settings with the given keys
 *
 * @param keys SettingsKey's array to be deleted
 *
 * @returns the operation's result set
 */
export async function deleteSettings(keys: SettingsKey[]) {
    let keysToDelete = ""
    if (keys.length >= 1) {
        keysToDelete += "?"
    }
    for (let i = 1; i < keys.length; i++) {
        keysToDelete += ", ?"
    }

    await globalAppDatabase.executeSql(`
        DELETE FROM settings WHERE key IN (${keysToDelete});
    `, keys)
}

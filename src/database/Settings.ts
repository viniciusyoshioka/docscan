import SQLite from "react-native-sqlite-storage"

import { cameraIdDefault, cameraTypeDefault, cameraFlashDefault, cameraWhiteBalanceDefault } from "@services/settings"
import { themeDefault } from "@services/theme"
import { SettingsKey, SettingsObject } from "@type/"
import { globalAppDatabase } from "."


export function createSettingsTable(): Promise<null> {
    return new Promise((resolve, reject) => {
        globalAppDatabase.executeSql(`
            SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'settings';
        `)
            .then(([resultSet]) => {
                return resultSet.rows.length === 1
            })
            .then(async (settingsTableExists: boolean) => {
                if (!settingsTableExists) {
                    await globalAppDatabase.executeSql(`
                        CREATE TABLE settings (
                            key TEXT,
                            value TEXT,
                            PRIMARY KEY("key")
                        );
                    `)
                    await globalAppDatabase.executeSql(`
                        INSERT INTO settings 
                            (key, value) 
                        VALUES 
                            ('theme', ?),
                            ('camera-flash', ?),
                            ('camera-whiteBalance', ?),
                            ('camera-type', ?),
                            ('camera-id', ?);
                    `, [themeDefault, cameraFlashDefault, cameraWhiteBalanceDefault, cameraTypeDefault, cameraIdDefault])
                }
                resolve(null)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


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

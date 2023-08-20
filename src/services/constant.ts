import RNFS from "react-native-fs"


export class Constants {

    // App
    static appId = "com.docscan"
    static appName = "DocScan"
    static appVersion = "1.18.3"
    static appType = __DEV__ ? "dev" : "release"

    // Icons
    static appIconOutline = require("./../image/docscan_outline.png")

    // Folder
    // Root folders
    static fullPathRootExternal = `${RNFS.ExternalStorageDirectoryPath}/Android/media/${this.appId}/${this.appName}`
    static fullPathRootInternal = `${RNFS.DocumentDirectoryPath}/${this.appName}`
    // External folders
    static fullPathExported = `${this.fullPathRootExternal}/Exported`
    static fullPathPdf = `${this.fullPathRootExternal}/PDF`
    // Internal folders
    static fullPathPicture = `${this.fullPathRootInternal}/Picture`
    static fullPathTemporaryExported = `${this.fullPathRootInternal}/TemporaryExported`
    static fullPathTemporaryImported = `${this.fullPathRootInternal}/TemporaryImported`
    static fullPathTemporaryCompressedPicture = `${this.fullPathRootInternal}/TemporaryCompressedPicture`

    // Database folders
    static databaseFolder = RNFS.DocumentDirectoryPath
    static appDatabaseFullPath = `${this.databaseFolder}/docscan_database.realm`
    static logDatabaseFullPath = `${this.databaseFolder}/docscan_log.realm`
    static exportDatabaseFullPath = `${this.databaseFolder}/docscan_export.realm`
    static importDatabaseFullPath = `${this.fullPathTemporaryImported}/docscan_export.realm`
}

import RNFS from "react-native-fs"


// App
export const appId = "com.docscan"
export const appName = "DocScan"
export const appVersion = "1.18.0"
export const appType = __DEV__ ? "beta" : "release"

// Icons
export const appIcon = require("./../image/docscan.png")
export const appIconOutline = require("./../image/docscan_outline.png")

// Folder
// Root folders
export const folderRoot = appName
export const fullPathRootInternal = `${RNFS.DocumentDirectoryPath}/${folderRoot}`
export const fullPathRootExternal = `${RNFS.ExternalStorageDirectoryPath}/Android/media/${appId}/${folderRoot}`
// External folders
export const fullPathExported = `${fullPathRootExternal}/Exported`
export const fullPathPdf = `${fullPathRootExternal}/PDF`
// Internal folders
export const fullPathPicture = `${fullPathRootInternal}/Picture`
export const fullPathTemporaryExported = `${fullPathRootInternal}/TemporaryExported`
export const fullPathTemporaryImported = `${fullPathRootInternal}/TemporaryImported`
export const fullPathTemporaryCompressedPicture = `${fullPathRootInternal}/TemporaryCompressedPicture`

// Database folders
export const databaseFolder = RNFS.DocumentDirectoryPath
export const appDatabaseFullPath = `${databaseFolder}/docscan_database.realm`
export const logDatabaseFullPath = `${databaseFolder}/docscan_log.realm`
export const exportDatabaseFullPath = `${databaseFolder}/docscan_export.realm`

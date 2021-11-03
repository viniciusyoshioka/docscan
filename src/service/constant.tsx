/* eslint-disable @typescript-eslint/no-var-requires */
import RNFS from "react-native-fs"


// App
export const appName = "DocScan"
export const appVersion = "1.14.0"
export const appType = __DEV__ ? "beta" : "release"

// Icon
const appIconPath = "./../image/"
//const appIconImage = "docscan.png"
const appIconImageOutline = "docscan_outline.png"
//export const appIcon = require(`${appIconPath}${appIconImage}`)
export const appIconOutline = require(`${appIconPath}${appIconImageOutline}`)

// Folder
// Root
export const folderRoot = appName
export const fullPathRoot = `${RNFS.CachesDirectoryPath}/${folderRoot}`
export const fullPathRootExternal = `${RNFS.ExternalStorageDirectoryPath}/${folderRoot}`
// Export
export const folderExported = "Exported"
export const relativePathExported = folderExported
export const fullPathExported = `${fullPathRootExternal}/${relativePathExported}`
// PDF
export const folderPdf = "PDF"
export const relativePathPdf = folderPdf
export const fullPathPdf = `${fullPathRootExternal}/${relativePathPdf}`
// Picture
export const folderPicture = "Picture"
export const relativePathPicture = folderPicture
export const fullPathPicture = `${fullPathRoot}/${relativePathPicture}`
// Temporary
export const folderTemporary = "Temporary"
export const relativePathTemporary = folderTemporary
export const fullPathTemporary = `${fullPathRoot}/${relativePathTemporary}`
// Temporary/Exported
export const folderTemporaryExported = "Exported"
export const relativePathTemporaryExported = `${relativePathTemporary}/${folderTemporaryExported}`
export const fullPathTemporaryExported = `${fullPathRoot}/${relativePathTemporaryExported}`
// Temporary/CompressedPicture
export const folderTemporaryCompressedPicture = "CompressedPicture"
export const relativePathTemporaryCompressedPicture = `${relativePathTemporary}/${folderTemporaryCompressedPicture}`
export const fullPathTemporaryCompressedPicture = `${fullPathRoot}/${relativePathTemporaryCompressedPicture}`

// File
// Log
export const fileLog = "docscanlog.log"
export const relativePathLog = fileLog
export const fullPathLog = `${fullPathRoot}/${relativePathLog}`

// AsyncStorage
export const storageTheme = "@docscan:theme"
export const storageDocumentId = "@docscan:document-id"
export const storageDocument = "@docscan:document"
export const storageDebugHome = "@docscan:debug-home"
export const storageSettings = "@docscan:settings"

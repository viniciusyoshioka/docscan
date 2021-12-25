/* eslint-disable @typescript-eslint/no-var-requires */
import RNFS from "react-native-fs"


// App
export const appName = "DocScan"
export const appVersion = "1.14.0"
export const appType = __DEV__ ? "beta" : "release"

// Icon
export const appIcon = require("./../image/docscan.png")
export const appIconOutline = require("./../image/docscan_outline.png")

// Folder
// Root
export const folderRoot = appName
export const fullPathRoot = `${RNFS.CachesDirectoryPath}/${folderRoot}`
export const fullPathRootExternal = `${RNFS.ExternalStorageDirectoryPath}/${folderRoot}`
// External/Export
export const folderExported = "Exported"
export const relativePathExported = `${folderRoot}/${folderExported}`
export const fullPathExported = `${fullPathRootExternal}/${folderExported}`
// External/PDF
export const folderPdf = "PDF"
export const relativePathPdf = `${folderRoot}/${folderPdf}`
export const fullPathPdf = `${fullPathRootExternal}/${folderPdf}`
// Internal/Picture
export const folderPicture = "Picture"
export const relativePathPicture = `${folderRoot}/${folderPicture}`
export const fullPathPicture = `${fullPathRoot}/${folderPicture}`
// Internal/Temporary
export const folderTemporary = "Temporary"
export const relativePathTemporary = `${folderRoot}/${folderTemporary}`
export const fullPathTemporary = `${fullPathRoot}/${folderTemporary}`
// Internal/Temporary/Exported
export const folderTemporaryExported = "Exported"
export const relativePathTemporaryExported = `${relativePathTemporary}/${folderTemporaryExported}`
export const fullPathTemporaryExported = `${fullPathTemporary}/${folderTemporaryExported}`
// Internal/Temporary/CompressedPicture
export const folderTemporaryCompressedPicture = "CompressedPicture"
export const relativePathTemporaryCompressedPicture = `${relativePathTemporary}/${folderTemporaryCompressedPicture}`
export const fullPathTemporaryCompressedPicture = `${fullPathTemporary}/${folderTemporaryCompressedPicture}`

// AsyncStorage
export const storageTheme = "@docscan:theme"
export const storageDocumentId = "@docscan:document-id"
export const storageDocument = "@docscan:document"
export const storageDebugHome = "@docscan:debug-home"
export const storageSettings = "@docscan:settings"

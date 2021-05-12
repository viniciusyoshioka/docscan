/* eslint-disable @typescript-eslint/no-var-requires */
import RNFS from "react-native-fs"


// Development
export const appInDevelopment = true

// App
export const appName = appInDevelopment ? "DocScanBeta" : "DocScan"
export const appFName = appInDevelopment ? "DocScan Beta" : "DocScan"
export const appVersion = "1.9.3"
export const appType = appInDevelopment ? "beta" : "release"

// Icon
const appIconPath = "./../image/app/"
const appIconImage = appInDevelopment ? "docscanbeta.png" : "docscan.png"
const appIconImageOutline = appInDevelopment ? "docscanbeta_outline.png" : "docscan_outline.png"
export const appIcon = require(`${appIconPath}${appIconImage}`)
export const appIconOutline = require(`${appIconPath}${appIconImageOutline}`)

// Folder
// Root
export const folderRoot = appFName
export const fullPathRoot = `${RNFS.CachesDirectoryPath}/${folderRoot}`
export const fullPathRootExternal = `${RNFS.ExternalStorageDirectoryPath}/${folderRoot}`
// PDF
export const folderPdf = "PDF"
export const relativePathPdf = folderPdf
export const fullPathPdf = `${fullPathRootExternal}/${relativePathPdf}`
// Picture
export const folderPicture = "Picture"
export const relativePathPicture = folderPicture
export const fullPathPicture = `${fullPathRoot}/${relativePathPicture}`
// Export
export const folderExported = "Exported"
export const relativePathExported = folderExported
export const fullPathExported = `${fullPathRootExternal}/${relativePathExported}`
// Temporary
export const folderTemporary = "Temporary"
export const relativePathTemporary = folderTemporary
export const fullPathTemporary = `${fullPathRoot}/${relativePathTemporary}`

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

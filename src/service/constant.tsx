/* eslint-disable @typescript-eslint/no-var-requires */
import RNFS from "react-native-fs"


// Development
export const appInDevelopment = true

// App
export const appName = appInDevelopment ? "DocScanBeta" : "DocScan"
export const appFName = appInDevelopment ? "DocScan Beta" : "DocScan"
export const appVersion = "1.9.0"
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
// Original
export const folderPictureOriginal = "Original"
export const relativePathPictureOriginal = folderPictureOriginal
export const fullPathPictureOriginal = `${fullPathRoot}/${relativePathPictureOriginal}`
// Cropped
export const folderPictureCropped = "Cropped"
export const relativePathPictureCropped = folderPictureCropped
export const fullPathPictureCropped = `${fullPathRoot}/${relativePathPictureCropped}`

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

// DebugHome
export const debugHomeShow = "show"
export const debugHomeHide = "hide"
export const debugHomeDefault = debugHomeShow

import RNFS from "react-native-fs"


// Development
export const appInDevelopment = true

// App
export const appName = appInDevelopment ? "DocScanBeta" : "DocScan"
export const appFName = appInDevelopment ? "DocScan Beta" : "DocScan"
export const appVersion = "0.0.26"
export const appType = appInDevelopment ? "beta" : "release"

// // App icon
// const appIconPath = "./../image/"
// const appIconImage = appInDevelopment ? "docscanbeta.png" : "docscan.png"
// const appIconImageOutline = appInDevelopment ? "docscanbeta_outline.png" : "docscan_outline.png"
// export const appIcon = require(`${appIconPath}${appIconImage}`)
// export const appIconOutline = require(`${appIconPath}${appIconImageOutline}`)

// External folder
// Root
export const folderRoot = appFName
export const pathRoot = appFName
export const fullPathRoot = `${RNFS.ExternalStorageDirectoryPath}/${pathRoot}`
// PDF
export const folderPdf = "PDF"
export const pathPdf = `${pathRoot}/${folderPdf}`
export const fullPathPdf = `${RNFS.ExternalStorageDirectoryPath}/${pathPdf}`
// Pictures
export const folderPicture = "Pictures"
export const pathPicture = `${pathRoot}/${folderPicture}`
export const fullPathPicture = `${RNFS.ExternalStorageDirectoryPath}/${pathPicture}`
// Pictures/Original
export const folderPictureOriginal = "Original"
export const pathPictureOriginal = `${pathPicture}/${folderPictureOriginal}`
export const fullPathPictureOriginal = `${RNFS.ExternalStorageDirectoryPath}/${pathPictureOriginal}`
// Pictures/Cropped
export const folderPictureCropped = "Cropped"
export const pathPictureCropped = `${pathPicture}/${folderPictureCropped}`
export const fullPathPictureCropped = `${RNFS.ExternalStorageDirectoryPath}/${pathPictureCropped}`

// AsyncStorage
export const storageTheme = "theme"
export const storageDocumentId = "document-id"
export const storageDocument = "document"
export const storageDebugHome = "debug-home"

// Theme
export const themeAuto = "auto"
export const themeLight = "light"
export const themeDark = "dark"
export const themeDefault = themeAuto

// DebugHome
export const debugHomeShow = "show"
export const debugHomeHide = "hide"
export const debugHomeDefault = debugHomeShow

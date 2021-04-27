import RNFS from "react-native-fs"

import { SettingsCameraProps, SettingsProps } from "./object-types"


// Development
export const appInDevelopment = true

// App
export const appName = appInDevelopment ? "DocScanBeta" : "DocScan"
export const appFName = appInDevelopment ? "DocScan Beta" : "DocScan"
export const appVersion = "1.7.1"
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

// File
// Log
export const fileLog = "docscanlog.log"
export const pathLog = `${pathRoot}/${fileLog}`
export const fullPathLog = `${RNFS.ExternalStorageDirectoryPath}/${pathLog}`

// AsyncStorage
export const storageTheme = "@docscan:theme"
export const storageDocumentId = "@docscan:document-id"
export const storageDocument = "@docscan:document"
export const storageDebugHome = "@docscan:debug-home"
export const storageSettings = "@docscan:settings"

// Theme
export const themeAuto = "auto"
export const themeLight = "light"
export const themeDark = "dark"
export const themeDefault = themeAuto

// DebugHome
export const debugHomeShow = "show"
export const debugHomeHide = "hide"
export const debugHomeDefault = debugHomeShow

// Settings
// Settings camera
export const settingsDefaultCamera: SettingsCameraProps = {
    flash: "off",
    whiteBalance: "auto"
}
// Settings
export const settingsDefault: SettingsProps = {
    camera: settingsDefaultCamera
}

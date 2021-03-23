
// Development
export const appInDevelopment = true

// App
export const appName = appInDevelopment ? "DocScanBeta" : "DocScan"
export const appFName = appInDevelopment ? "DocScan Beta" : "DocScan"
export const appVersion = "0.0.8"
export const appType = appInDevelopment ? "beta" : "release"

// // App icon
// const appIconPath = "./../image/"
// const appIconImage = appInDevelopment ? "docscanbeta.png" : "docscan.png"
// const appIconImageOutline = appInDevelopment ? "docscanbeta_outline.png" : "docscan_outline.png"
// export const appIcon = require(`${appIconPath}${appIconImage}`)
// export const appIconOutline = require(`${appIconPath}${appIconImageOutline}`)

// AsyncStorage
export const storageTheme = "theme"
export const storageDocumentId = "document-id"
export const storageDocument = "document"

// Theme
export const themeAuto = "auto"
export const themeLight = "light"
export const themeDark = "dark"
export const themeDefault = themeAuto

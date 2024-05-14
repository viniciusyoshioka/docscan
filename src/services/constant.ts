import RNFS from "react-native-fs"


export class Constants {

  // App
  static appId = "com.docscan"
  static appName = "DocScan"
  static appVersion = "1.20.0"
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

  // Database
  static databaseFolder = RNFS.DocumentDirectoryPath

  static appDatabaseFileName = "docscan_database.sqlite"
  static logDatabaseFileName = "docscan_log.sqlite"
  static exportDatabaseFileName = "docscan_export.sqlite"
  static importDatabaseFileName = "docscan_import.sqlite"

  static appDatabaseFullPath = `${this.databaseFolder}/${this.appDatabaseFileName}`
  static logDatabaseFullPath = `${this.databaseFolder}/${this.logDatabaseFileName}`
  static exportDatabaseFullPath = `${this.databaseFolder}/${this.exportDatabaseFileName}`
  static importDatabaseFullPath = `${this.fullPathTemporaryImported}/${this.importDatabaseFileName}`
}

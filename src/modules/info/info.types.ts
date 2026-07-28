import type { DatabaseName } from '@database'


export interface AppInfo {
  name: string
  version: string
  iconSolid: unknown
  iconOutline: unknown
}


export interface FoldersInfo {
  internal: {
    data: string
    temp: string
    databases: string
    pictures: string
    temporaryImportedDocuments: string
    temporaryExportedDocuments: string
    temporaryCompressedPictures: string
    temporaryExportedPdfs: string
  }
  external: {
    data: string
    exportedDocuments: string
    exportedPdfs: string
  }
}


export type DatabaseInfo = {
  [K in DatabaseName]: {
    fileName: string
    exportFileName: string
    importFileName: string | null
    fullPath: string
    exportFullPath: string
    importFullPath: string | null
  }
}

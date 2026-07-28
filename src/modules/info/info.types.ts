
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


type Databases = 'app' | 'log'

export type DatabaseInfo = {
  [K in Databases]: {
    fileName: string
    absolutePath: string
    relativePath: string
  }
}

import { DatabaseName } from '@database'

import type { AppInfo, DatabaseInfo, FoldersInfo } from './info.types.ts'


export class Info {


  static readonly app: AppInfo = {
    name: 'DocScan',
    version: '1.20.0',
    iconSolid: require('../../../assets/images/docscan.png'),
    iconOutline: require('../../../assets/images/docscan_outline.png'),
  }


  // TODO
  static readonly folders: FoldersInfo = {
    internal: {
      data: '',
      temp: '',
      pictures: '',
      temporaryImportedDocuments: '',
      temporaryExportedDocuments: '',
      temporaryCompressedPictures: '',
      temporaryExportedPdfs: '',
    },
    external: {
      data: '',
      exportedDocuments: '',
      exportedPdfs: '',
    },
  }


  // TODO
  static readonly database: DatabaseInfo = {
    [DatabaseName.APP]: {
      fileName: 'docscan_database.sqlite',
      exportFileName: 'docscan_export.sqlite',
      importFileName: 'docscan_import.sqlite',
      fullPath: '',
      exportFullPath: '',
      importFullPath: '',
    },
    [DatabaseName.LOG]: {
      fileName: 'docscan_log.sqlite',
      exportFileName: 'docscan_log.sqlite',
      importFileName: null,
      fullPath: '',
      exportFullPath: '',
      importFullPath: null,
    },
  }
}

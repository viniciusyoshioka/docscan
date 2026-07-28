import { DatabaseName } from '@database'
import {
  AbsolutePath,
  APP_DOCUMENT_FOLDER,
  APP_TEMP_FOLDER,
  SYS_EXTERNAL_STORAGE_FOLDER,
} from '@modules/file-system'
import type { AppInfo, DatabaseInfo, FoldersInfo } from './info.types.ts'


export class Info {


  static readonly app: AppInfo = {
    name: 'DocScan',
    version: '1.20.0',
    iconSolid: require('../../../assets/images/docscan.png'),
    iconOutline: require('../../../assets/images/docscan_outline.png'),
  }


  private static readonly internalDataPath = AbsolutePath.join([
    APP_DOCUMENT_FOLDER,
    this.app.name,
  ])
  private static readonly internalTempPath = AbsolutePath.join([
    APP_TEMP_FOLDER,
    this.app.name,
  ])
  private static readonly externalDataPath = AbsolutePath.join([
    SYS_EXTERNAL_STORAGE_FOLDER,
    this.app.name,
  ])

  static readonly folders: FoldersInfo = {
    internal: {
      data: this.internalDataPath,
      temp: this.internalTempPath,
      databases: AbsolutePath.join([
        this.internalDataPath,
        'databases',
      ]),
      pictures: AbsolutePath.join([
        this.internalDataPath,
        'pictures',
      ]),
      temporaryImportedDocuments: AbsolutePath.join([
        this.internalTempPath,
        'imported-documents',
      ]),
      temporaryExportedDocuments: AbsolutePath.join([
        this.internalTempPath,
        'exported-documents',
      ]),
      temporaryCompressedPictures: AbsolutePath.join([
        this.internalTempPath,
        'compressed-pictures',
      ]),
      temporaryExportedPdfs: AbsolutePath.join([
        this.internalTempPath,
        'exported-pdfs',
      ]),
    },
    external: {
      data: this.externalDataPath,
      exportedDocuments: AbsolutePath.join([
        this.externalDataPath,
        'exported-documents',
      ]),
      exportedPdfs: AbsolutePath.join([
        this.externalDataPath,
        'exported-pdfs',
      ]),
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

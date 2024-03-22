import { NativeModules } from "react-native"
import RNFS from "react-native-fs"
import { v4 as uuid4 } from "uuid"

import { translate } from "@locales"
import { Constants } from "../constant"
import { DateService } from "../date"
import { DocumentServiceType } from "./native-types"
import {
  DocumentDataToExport,
  PictureDataToCopy,
  PictureDataToDelete,
  PictureDataToMove,
} from "./types"


const NativeDocumentService = NativeModules.DocumentService as DocumentServiceType


export class DocumentService {


  static getNewName(): string {
    return translate("document_newDocumentName")
  }


  static getFileFullname(filePath: string): string {
    const splittedFilePath = filePath.split("/")
    return splittedFilePath[splittedFilePath.length - 1]
  }

  static getFileExtension(filePath: string): string {
    if (filePath.startsWith("."))
      return filePath

    const splittedFilePath = filePath.split(".")
    return splittedFilePath[splittedFilePath.length - 1]
  }


  static getTemporaryExportedDocumentPath(): string {
    return `${Constants.fullPathTemporaryExported}/temporary_exported_document.zip`
  }

  static getExportedDocumentPath(): string {
    const name = translate("document_exportedDocumentName")
    const date = DateService.getDate().replaceAll("-", "")
    const time = DateService.getTime().replaceAll("-", "")
    return `${Constants.fullPathExported}/${name} ${date}_${time}.zip`
  }

  static getTemporaryImportedPicturePath(fileName: string): string {
    return `${Constants.fullPathTemporaryImported}/${fileName}`
  }

  static getPdfPath(documentName: string): string {
    return `${Constants.fullPathPdf}/${documentName}.pdf`
  }

  static getPicturePath(fileName: string): string {
    return `${Constants.fullPathPicture}/${fileName}`
  }

  static async getNewPicturePath(filePath: string): Promise<string> {
    const fileExtension = this.getFileExtension(filePath)

    let newPath: string
    do {
      const fileName = uuid4()
      newPath = `${Constants.fullPathPicture}/${fileName}.${fileExtension}`
    } while (await RNFS.exists(newPath))
    return newPath
  }


  static deletePicturesService(data: PictureDataToDelete) {
    NativeDocumentService.deletePictures({
      pictures: data.pictures,
      notificationTitle: data.notificationTitle ?? translate("document_notification_deletingImages_title"),
    })
  }

  static copyPicturesService(data: PictureDataToCopy) {
    NativeDocumentService.copyPictures({
      pictures: data.pictures,
      notificationTitle: data.notificationTitle ?? translate("document_notification_copyingImages_title"),
    })
  }

  static movePicturesService(data: PictureDataToMove) {
    NativeDocumentService.movePictures({
      pictures: data.pictures,
      notificationTitle: data.notificationTitle ?? translate("document_notification_movingImages_title"),
    })
  }

  static exportDocumentService(data: DocumentDataToExport) {
    NativeDocumentService.exportDocument({
      pictures: data.pictures,
      databasePath: data.databasePath,
      pathZipTo: data.pathZipTo,
      pathExportedDocument: data.pathExportedDocument,
      notificationTitle: data.notificationTitle ?? translate("document_notification_exportingDocuments_title"),
    })
  }
}

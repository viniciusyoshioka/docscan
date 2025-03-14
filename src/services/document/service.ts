import { NativeModules } from "react-native"

import { StandardDateFormatter } from "@libs/date-formatter"
import { translate } from "@locales"
import { Constants } from "@services/constant"
import { DocumentServiceType } from "./native-types"
import {
  DocumentDataToExport,
  PictureDataToCopy,
  PictureDataToDelete,
  PictureDataToMove,
} from "./types"


const NativeDocumentService = NativeModules.DocumentService as DocumentServiceType


export class DocumentService {


  private static readonly dateFormatter = new StandardDateFormatter({
    separators: {
      date: "",
      time: "",
    },
  })


  static getNewName(): string {
    return translate("untitleDocument")
  }

  static getTemporaryExportedDocumentPath(): string {
    return `${Constants.fullPathTemporaryExported}/temporary_exported_document.zip`
  }

  static getExportedDocumentPath(): string {
    const name = translate("document_exportedDocumentName")
    const dateTime = this.dateFormatter.formatDateTime().replaceAll(" ", "_")
    return `${Constants.fullPathExported}/${name} ${dateTime}.zip`
  }

  static getTemporaryImportedPicturePath(fileName: string): string {
    return `${Constants.fullPathTemporaryImported}/${fileName}`
  }

  static getPdfPath(documentName: string): string {
    return `${Constants.fullPathPdf}/${documentName}.pdf`
  }

  static deletePicturesService(data: PictureDataToDelete) {
    NativeDocumentService.deletePictures({
      pictures: data.pictures,
      notificationTitle: (
        data.notificationTitle
        ?? translate("document_notification_deletingImages_title")
      ),
    })
  }

  static copyPicturesService(data: PictureDataToCopy) {
    NativeDocumentService.copyPictures({
      pictures: data.pictures,
      notificationTitle: (
        data.notificationTitle
        ?? translate("document_notification_copyingImages_title")
      ),
    })
  }

  static movePicturesService(data: PictureDataToMove) {
    NativeDocumentService.movePictures({
      pictures: data.pictures,
      notificationTitle: (
        data.notificationTitle
        ?? translate("document_notification_movingImages_title")
      ),
    })
  }

  static exportDocumentService(data: DocumentDataToExport) {
    NativeDocumentService.exportDocument({
      pictures: data.pictures,
      databasePath: data.databasePath,
      pathZipTo: data.pathZipTo,
      pathExportedDocument: data.pathExportedDocument,
      notificationTitle: (
        data.notificationTitle
        ?? translate("document_notification_exportingDocuments_title")
      ),
    })
  }
}

import { NativeModules } from "react-native"
import RNFS from "react-native-fs"
import { v4 as uuid4 } from "uuid"

import { translate } from "../locales"
import { fullPathExported, fullPathPdf, fullPathPicture, fullPathTemporaryExported } from "./constant"
import { getDate, getTime } from "./date"


const NativeDocumentService = NativeModules.DocumentService


export interface DocumentDataToExport {
    pictures: string[];
    databasePath: string;
    pathZipTo: string;
    pathExportedDocument: string;
    notificationTitle?: string;
}


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


    static getPdfPath(documentName: string): string {
        return `${fullPathPdf}/${documentName}.pdf`
    }


    static getPicturePath(fileName: string): string {
        return `${fullPathPicture}/${fileName}`
    }

    static async getNewPicturePath(filePath: string): Promise<string> {
        const fileExtension = this.getFileExtension(filePath)

        let newPath: string
        do {
            const fileName = uuid4()
            newPath = `${fullPathPicture}/${fileName}.${fileExtension}`
        } while (await RNFS.exists(newPath))
        return newPath
    }


    static getTemporaryExportedDocumentPath(): string {
        return `${fullPathTemporaryExported}/temporary_exported_document.zip`
    }

    static getExportedDocumentPath(): string {
        const name = translate("document_exportedDocumentName")
        const date = getDate().replaceAll("-", "")
        const time = getTime().replaceAll("-", "")
        return `${fullPathExported}/${name} ${date}_${time}.zip`
    }


    static deletePicturesService(pictures: string[], notificationTitle?: string) {
        NativeDocumentService.deletePictures(
            pictures,
            notificationTitle ?? translate("document_notification_deletingImages_title")
        )
    }

    static copyPicturesService(pictures: string[], notificationTitle?: string) {
        NativeDocumentService.copyPictures(
            pictures,
            notificationTitle ?? translate("document_notification_copyingImages_title")
        )
    }

    static movePicturesService(pictures: string[], notificationTitle?: string) {
        NativeDocumentService.movePictures(
            pictures,
            notificationTitle ?? translate("document_notification_movingImages_title")
        )
    }

    static exportDocumentService(data: DocumentDataToExport) {
        NativeDocumentService.exportDocument(
            data.pictures,
            data.databasePath,
            data.pathZipTo,
            data.pathExportedDocument,
            data.notificationTitle ?? translate("document_notification_exportingDocuments_title")
        )
    }
}

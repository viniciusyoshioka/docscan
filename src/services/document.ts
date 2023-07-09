import { NativeModules } from "react-native"
import RNFS from "react-native-fs"
import { v4 as uuid4 } from "uuid"

import { translate } from "../locales"
import { fullPathPicture, fullPathTemporaryExported } from "./constant"


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


    static async getNewPicturePath(filePath: string): Promise<string> {
        const fileExtension = this.getFileExtension(filePath)

        let newPath: string
        do {
            const fileName = uuid4()
            newPath = `${fullPathPicture}/${fileName}.${fileExtension}`
        } while (await RNFS.exists(newPath))
        return newPath
    }

    static async getPictureTemporaryExportPath(imagePath: string): Promise<string> {
        const fileName = this.getFileFullname(imagePath)
        return `${fullPathTemporaryExported}/${fileName}`
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

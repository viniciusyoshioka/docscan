import { NativeModules } from "react-native"

import { translate } from "../locales"


const { DocumentService } = NativeModules


export function deletePicturesService(pictures: string[], notificationTitle?: string) {
    DocumentService.deletePictures(
        pictures,
        notificationTitle ?? translate("documentService_notification_deletingImages_title")
    )
}


export function copyPicturesService(pictures: string[], notificationTitle?: string) {
    DocumentService.copyPictures(
        pictures,
        notificationTitle ?? translate("documentService_notification_copyingImages_title")
    )
}


export function movePicturesService(pictures: string[], notificationTitle?: string) {
    DocumentService.movePictures(
        pictures,
        notificationTitle ?? translate("documentService_notification_movingImages_title")
    )
}


export interface DocumentoToExportData {
    pictures: string[];
    databasePath: string;
    pathZipTo: string;
    pathExportedDocument: string;
    notificationTitle?: string;
}


export function exportDocumentService(data: DocumentoToExportData) {
    DocumentService.exportDocument(
        data.pictures,
        data.databasePath,
        data.pathZipTo,
        data.pathExportedDocument,
        data.notificationTitle ?? translate("documentService_notification_exportingDocuments_title")
    )
}

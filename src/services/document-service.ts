import { NativeModules } from "react-native"

import { translate } from "../locales"


const { DocumentService } = NativeModules


/**
 * Invokes a service to delete files
 *
 * @param pictures array of file paths to be deleted
 * @param notificationTitle string to be shown in notification title
 */
export function deletePicturesService(pictures: string[], notificationTitle?: string) {
    DocumentService.deletePictures(
        pictures,
        notificationTitle ?? translate("documentService_notification_deletingImages_title")
    )
}


/**
 * Invokes a service to copy files
 *
 * @param pictures array of file paths to be copied.
 * @param notificationTitle string to be shown in notification title
 *
 * Obs.: The from and to paths are followed in the array.
 * I.e. ["/path/from/1", "/path/to/1", "/path/from/2", "/path/to/2"]
 */
export function copyPicturesService(pictures: string[], notificationTitle?: string) {
    DocumentService.copyPictures(
        pictures,
        notificationTitle ?? translate("documentService_notification_copyingImages_title")
    )
}


/**
 * Invokes a service to move files
 *
 * @param pictures array of file paths to be moved.
 * @param notificationTitle string to be shown in notification title
 *
 * Obs.: The from and to paths are followed in the array.
 * I.e. ["/path/from/1", "/path/to/1", "/path/from/2", "/path/to/2"]
 */
export function movePicturesService(pictures: string[], notificationTitle?: string) {
    DocumentService.movePictures(
        pictures,
        notificationTitle ?? translate("documentService_notification_movingImages_title")
    )
}


/**
 * Invokes a service to export documents
 *
 * @param pictures string array with all the document picture path to export
 * @param databasePath path to the database that stores the document data
 * @param pathZipTo path to a temporary folder where the zip file will be until the export is finished
 * @param pathExportedDocument final path where the zip file will be moved to be accessed by the user
 * @param notificationTitle string to be shown in notification title
 */
export function exportDocumentService(
    pictures: string[],
    databasePath: string,
    pathZipTo: string,
    pathExportedDocument: string,
    notificationTitle?: string
) {
    DocumentService.exportDocument(
        pictures,
        databasePath,
        pathZipTo,
        pathExportedDocument,
        notificationTitle ?? translate("documentService_notification_exportingDocuments_title")
    )
}

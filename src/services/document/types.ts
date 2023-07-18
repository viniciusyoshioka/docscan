
export type PictureDataToDelete = {
    pictures: string[];
    notificationTitle?: string;
}

export type PictureDataToCopy = {
    pictures: string[];
    notificationTitle?: string;
}

export type PictureDataToMove = {
    pictures: string[];
    notificationTitle?: string;
}

export type DocumentDataToExport = {
    pictures: string[];
    databasePath: string;
    pathZipTo: string;
    pathExportedDocument: string;
    notificationTitle?: string;
}

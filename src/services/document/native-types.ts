
type DeletePictureParams = {
    pictures: string[]
    notificationTitle: string
}

type CopyPictureParams = {
    pictures: string[]
    notificationTitle: string
}

type MovePictureParams = {
    pictures: string[]
    notificationTitle: string
}

type ExportDocumentParams = {
    pictures: string[]
    databasePath: string
    pathZipTo: string
    pathExportedDocument: string
    notificationTitle: string
}


export type DocumentServiceType = {
    deletePictures: (params: DeletePictureParams) => void
    copyPictures: (params: CopyPictureParams) => void
    movePictures: (params: MovePictureParams) => void
    exportDocument: (params: ExportDocumentParams) => void
}

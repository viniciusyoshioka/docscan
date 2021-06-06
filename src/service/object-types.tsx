
// Document
export type Document = {
    id: number,
    name: string,
    pictureList: Array<string>,
    lastModificationDate: string,
}

export type ExportedDocument = {
    name: string,
    pictureList: Array<string>,
}


// Debug Home
export type debugHome = "show" | "hide"
export const debugHomeDefault: debugHome = "show"


// cameraId
export type cameraIdType = {
    id: string,
    type: number,
}


export type DocumentForList = {
    id: number,
    name: string,
    lastModificationTimestamp: string,
}


export type SimpleDocument = {
    name: string,
}


export type DocumentPicture = {
    id: number | undefined,
    filepath: string,
    position: number
}


export type Document = {
    id: number | undefined,
    name: string,
    pictureList: DocumentPicture[],
    lastModificationTimestamp: string,
}

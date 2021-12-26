
export type DocumentForList = {
    id: number,
    name: string,
    lastModificationTimestamp: string,
}


export type SimpleDocument = {
    name: string,
}


export type DocumentPicture = {
    id: number,
    filepath: string,
    position: number
}


export type Document = {
    id: number,
    name: string,
    pictureList: Array<string>,
    lastModificationTimestamp: string,
}

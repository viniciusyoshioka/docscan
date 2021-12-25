
export type DocumentForList = {
    id: number,
    name: string,
    lastModificationTimestamp: string,
}


export type SimpleDocument = {
    name: string,
    pictureList: Array<string>,
}


export type Document = {
    id: number,
    name: string,
    pictureList: Array<string>,
    lastModificationTimestamp: string,
}

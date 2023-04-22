
export type DocumentForList = {
    id: number;
    name: string;
    lastModificationTimestamp: string;
}


export type SimpleDocument = {
    name: string;
    lastModificationTimestamp: string;
}


export type DocumentPicture = {
    id: number | undefined;
    filePath: string;
    fileName: string;
    position: number;
}


export type Document = {
    id: number | undefined;
    name: string;
    pictureList: DocumentPicture[];
    lastModificationTimestamp: string;
    hasChanges?: boolean;
}

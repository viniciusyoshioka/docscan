import { DocumentPicture } from "."


type documentRename = {
    type: "rename-document",
    payload: string,
}

type documentAddPicture = {
    type: "add-picture",
    payload: DocumentPicture[],
}

type documentRemovePicture = {
    type: "remove-picture",
    payload: number[],
}


export type documentDataReducerAction = documentRename
    | documentAddPicture
    | documentRemovePicture

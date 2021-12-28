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

type documentReplacePicture = {
    type: "replace-picture",
    payload: {
        indexToReplace: number,
        newPicture: string,
    },
}


export type documentDataReducerAction = documentRename
    | documentAddPicture
    | documentRemovePicture
    | documentReplacePicture

import { DocumentPicture } from "."


type documentCreateNewIfEmpty = {
    type: "create-new-if-empty",
}

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


export type documentDataReducerAction = documentCreateNewIfEmpty
    | documentRename
    | documentAddPicture
    | documentRemovePicture
    | documentReplacePicture

import { DocumentForList, DocumentPicture } from "."


type documentSetDocument = {
    type: "set-document",
    payload: {
        document: DocumentForList,
        pictureList: DocumentPicture[],
    },
}

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

type documentSave = {
    type: "save-document",
}

type documentClose = {
    type: "close-document",
}


export type documentDataReducerAction = documentSetDocument
    | documentCreateNewIfEmpty
    | documentRename
    | documentAddPicture
    | documentRemovePicture
    | documentReplacePicture
    | documentSave
    | documentClose

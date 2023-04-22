import { Dispatch } from "react"

import { Document, DocumentForList, DocumentPicture } from "../../types"


type DocumentSetDocument = {
    type: "set-document";
    payload: {
        document: DocumentForList;
        pictureList: DocumentPicture[];
    };
}

type DocumentCreateNewIfEmpty = {
    type: "create-new-if-empty";
}

type DocumentRename = {
    type: "rename-document";
    payload: string;
}

type DocumentAddPicture = {
    type: "add-picture";
    payload: DocumentPicture[];
}

type DocumentRemovePicture = {
    type: "remove-picture";
    payload: number[];
}

type DocumentReplacePicture = {
    type: "replace-picture";
    payload: {
        indexToReplace: number;
        newPicturePath: string;
        newPictureName: string;
    };
}

type DocumentSave = {
    type: "save-document";
    payload: (documentId: number) => void;
}

type DocumentSaveAndClose = {
    type: "save-and-close-document";
}

type DocumentClose = {
    type: "close-document";
}

export type DocumentDataReducerAction = DocumentSetDocument
    | DocumentCreateNewIfEmpty
    | DocumentRename
    | DocumentAddPicture
    | DocumentRemovePicture
    | DocumentReplacePicture
    | DocumentSave
    | DocumentSaveAndClose
    | DocumentClose


export interface DocumentDataContextValue {
    documentDataState: Document | undefined;
    dispatchDocumentData: Dispatch<DocumentDataReducerAction>;
}

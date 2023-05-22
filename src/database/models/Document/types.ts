import { Realm } from "@realm/react"

import { Document, DocumentInMemory, DocumentPicture } from "../../interfaces"
import { DocumentPictureSchema, DocumentSchema } from "../../schemas"


export type DocumentModelState = DocumentInMemory & {
    pictures: DocumentPicture[];
    __documentFromRealm?: DocumentSchema;
}


export type DocumentModelActionPayload = {
    createNewIfEmpty: undefined;
    setData: {
        realm: Realm;
        document: Document | DocumentSchema;
        pictures: DocumentPicture[] | DocumentPictureSchema[];
    };
    rename: {
        realm: Realm;
        newName: string;
    };
    addPictures: {
        realm: Realm;
        picturesToAdd: string[];
    };
    removePictures: {
        realm: Realm;
        picturesToRemove: number[];
    };
    replacePicture: {
        realm: Realm;
        indexToReplace: number;
        newPicturePath: string;
    };
    saveIfNotWritten: {
        realm: Realm;
    };
    close: undefined;
}


export type DocumentModelActionType = keyof DocumentModelActionPayload


export type DocumentModelAction<T extends DocumentModelActionType> = {
    type: T;
    payload: DocumentModelActionPayload[T];
}


export type DocumentModelActionObject = {
    [K in DocumentModelActionType]: (
        previousState: DocumentModelState | undefined,
        payload: DocumentModelActionPayload[K]
    ) => DocumentModelState | undefined;
}

import { DocumentForList, DocumentPicture } from "."


/**
 * Action that receives all document data to set its state.
 * Usually called when an document is opened or
 * to set a new state after saving.
 */
type DocumentSetDocument = {
    type: "set-document";
    payload: {
        document: DocumentForList;
        pictureList: DocumentPicture[];
    };
}

/**
 * Action that creates an new document if one doesn't exists.
 * The new document contains a generic name and the last modification timestamp,
 * while the other data is empty.
 */
type DocumentCreateNewIfEmpty = {
    type: "create-new-if-empty";
}

/**
 * Receives a string with the new document name and sets it to the state
 */
type DocumentRename = {
    type: "rename-document";
    payload: string;
}

/**
 * Receives an array of `DocumentPicture` to add to `pictureList` property
 */
type DocumentAddPicture = {
    type: "add-picture";
    payload: DocumentPicture[];
}

/**
 * Receives an array with `DocumentPicture`'s index to be removed
 *
 * This action just removes the images from the state
 * and updates the position property.
 * File and database deletion still needs to be invoked.
 */
type DocumentRemovePicture = {
    type: "remove-picture";
    payload: number[];
}

/**
 * Replaces the picture path in the `indexToReplace`'s
 * index for the path of newPicture
 */
type DocumentReplacePicture = {
    type: "replace-picture";
    payload: {
        indexToReplace: number;
        newPicturePath: string;
        newPictureName: string;
    };
}

/**
 * Saves the document data into the database and when
 * it's done, the callback in payload is invoked to
 * set new data in the state.
 * Those new data are the document id and/or
 * the id of document pictures.
 *
 * This action only saves data addition or replacement.
 * If any data were removed, the file and database deletion still
 * has to be invoked.
 */
type DocumentSave = {
    type: "save-document";
    payload: (documentId: number) => void;
}

/**
 * Saves the data in the state into the database
 * and closes the document
 *
 * This action only saves data addition or replacement.
 * If any data were removed, the file and database
 * deletion has to be invoked before.
 */
type DocumentSaveAndClose = {
    type: "save-and-close-document";
}

/**
 * This action just closes the document.
 * It means that the state passes to be undefined.
 * THIS ACTION DON'T SAVE THE DATA.
 */
type DocumentClose = {
    type: "close-document";
}


/**
 * Actions for document data reducer to handler with the document state
 */
export type DocumentDataReducerAction = DocumentSetDocument
    | DocumentCreateNewIfEmpty
    | DocumentRename
    | DocumentAddPicture
    | DocumentRemovePicture
    | DocumentReplacePicture
    | DocumentSave
    | DocumentSaveAndClose
    | DocumentClose

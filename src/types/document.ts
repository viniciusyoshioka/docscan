import { Dispatch } from "react"

import { DocumentDataReducerAction } from "."


/**
 * Contains all document's attributes needed for a list.
 * Usually returned from database through the method getDocumentList.
 */
export type DocumentForList = {
    id: number;
    name: string;
    lastModificationTimestamp: string;
}


/**
 * Contains all document's data, except the id, from the document table.
 * Usually returned from database through the method getDocument.
 */
export type SimpleDocument = {
    name: string;
    lastModificationTimestamp: string;
}


/**
 * Contains all document pictures's data
 * Usually used when working with the document picture list
 */
export type DocumentPicture = {
    id: number | undefined;
    filepath: string;
    position: number;
}


/**
 * Type that defines the complete document
 */
export type Document = {
    id: number | undefined;
    name: string;
    pictureList: DocumentPicture[];
    lastModificationTimestamp: string;
    hasChanges?: boolean;
}


/**
 * Type for the document data state and dispatch,
 * returned by the reducer hook
 */
export type DocumentDataContextType = [undefined | Document, Dispatch<DocumentDataReducerAction>]

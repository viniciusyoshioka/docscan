import { createContext, useContext } from "react"

import { DocumentDatabase } from "../database"
import { Document, documentDataContextType, documentDataReducerAction } from "../types"
import { getDateTime, getTimestamp } from "./date"


export function getDocumentName(): string {
    return `Documento ${getDateTime("-", "-", true)}`
}


export function reducerDocumentData(
    state: Document | undefined,
    action: documentDataReducerAction
): Document | undefined {
    switch (action.type) {
        case "set-document":
            return {
                ...action.payload.document,
                pictureList: action.payload.pictureList
            }
        case "create-new-if-empty":
            if (!state) {
                return {
                    id: undefined,
                    name: getDocumentName(),
                    pictureList: [],
                    lastModificationTimestamp: getTimestamp(),
                }
            }

            return state
        case "rename-document":
            if (!state) {
                return {
                    id: undefined,
                    name: action.payload,
                    pictureList: [],
                    lastModificationTimestamp: getTimestamp(),
                }
            }

            return {
                ...state,
                name: action.payload,
                lastModificationTimestamp: getTimestamp(),
            }
        case "add-picture":
            if (!state) {
                return {
                    id: undefined,
                    name: getDocumentName(),
                    pictureList: [...action.payload],
                    lastModificationTimestamp: getTimestamp(),
                }
            }

            return {
                ...state,
                pictureList: [...state.pictureList, ...action.payload],
                lastModificationTimestamp: getTimestamp(),
            }
        case "remove-picture":
            if (!state) {
                return undefined
            }

            return {
                ...state,
                pictureList: state.pictureList.filter((_, index) => {
                    return !action.payload.includes(index)
                }),
                lastModificationTimestamp: getTimestamp(),
            }
        case "replace-picture":
            if (!state) {
                return undefined
            }

            state.pictureList[action.payload.indexToReplace].filepath = action.payload.newPicture
            return {
                ...state,
                pictureList: state?.pictureList,
                lastModificationTimestamp: getTimestamp(),
            }
        case "save-document":
            if (!state) {
                return undefined
            }

            if (state.id) {
                DocumentDatabase.updateDocument(
                    state.id,
                    state.name,
                    state.pictureList
                )
                return state
            }

            if (state.pictureList.length > 0) {
                DocumentDatabase.insertDocument(
                    state.name,
                    state.pictureList
                )
            }
            return state
        case "close-document":
            return undefined
        default:
            throw new Error("Unknown action type")
    }
}


const documentDataContext = createContext([
    undefined,
    (value: documentDataReducerAction) => {}
] as documentDataContextType)

export const DocumentDataProvider = documentDataContext.Provider

export function useDocumentData() {
    return useContext(documentDataContext)
}

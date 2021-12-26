import { createContext, useContext } from "react"

import { Document, documentDataReducerAction } from "../types"
import { getDateTime } from "./date"


export function getDocumentName(): string {
    return `Documento ${getDateTime("-", "-", true)}`
}


export function reducerDocumentData(state: Document, action: documentDataReducerAction): Document {
    switch (action.type) {
        case "rename-document":
            return {
                ...state,
                name: action.payload,
            }
        case "add-picture":
            return {
                ...state,
                pictureList: [...state.pictureList, ...action.payload],
            }
        case "remove-picture":
            return {
                ...state,
                pictureList: state.pictureList.filter((_, index) => {
                    return !action.payload.includes(index)
                })
            }
        default:
            throw new Error("Unknown action type")
    }
}


const documentDataContext = createContext([{} as Document, (value: documentDataReducerAction) => {}])

export const DocumentDataProvider = documentDataContext.Provider

export function useDocumentData() {
    return useContext(documentDataContext)
}

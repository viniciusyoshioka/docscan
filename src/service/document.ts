import { createContext, useContext } from "react"

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
        case "rename-document":
            if (!state) {
                return {
                    id: undefined,
                    name: getDocumentName(),
                    pictureList: [],
                    lastModificationTimestamp: getTimestamp()
                }
            }

            return {
                ...state,
                name: action.payload,
            }
        case "add-picture":
            if (!state) {
                return {
                    id: undefined,
                    name: getDocumentName(),
                    pictureList: [...action.payload],
                    lastModificationTimestamp: getTimestamp()
                }
            }

            return {
                ...state,
                pictureList: [...state.pictureList, ...action.payload],
            }
        case "remove-picture":
            if (!state) {
                return undefined
            }

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


const documentDataContext = createContext([
    undefined,
    (value: documentDataReducerAction) => {}
] as documentDataContextType)

export const DocumentDataProvider = documentDataContext.Provider

export function useDocumentData() {
    return useContext(documentDataContext)
}

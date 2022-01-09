import { createContext, useContext } from "react"

import { DocumentDatabase } from "../database"
import { Document, DocumentDataContextType, DocumentDataReducerAction } from "../types"
import { getTimestamp } from "./date"


export function getDocumentName(): string {
    return "Novo documento"
}


export function reducerDocumentData(
    state: Document | undefined,
    action: DocumentDataReducerAction
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
                    hasChanges: true,
                }
            }

            return {
                ...state
            }
        case "rename-document":
            if (!state) {
                return {
                    id: undefined,
                    name: action.payload,
                    pictureList: [],
                    lastModificationTimestamp: getTimestamp(),
                    hasChanges: true,
                }
            }

            return {
                ...state,
                name: action.payload,
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "add-picture":
            if (!state) {
                return {
                    id: undefined,
                    name: getDocumentName(),
                    pictureList: [...action.payload],
                    lastModificationTimestamp: getTimestamp(),
                    hasChanges: true,
                }
            }

            return {
                ...state,
                pictureList: [...state.pictureList, ...action.payload],
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "remove-picture":
            if (!state) {
                return undefined
            }

            return {
                ...state,
                pictureList: state.pictureList
                    .filter((_, index) => {
                        return !action.payload.includes(index)
                    })
                    .map((item, index) => {
                        return {
                            ...item,
                            position: index,
                        }
                    }),
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "replace-picture":
            if (!state) {
                return undefined
            }

            state.pictureList[action.payload.indexToReplace].filepath = action.payload.newPicture
            return {
                ...state,
                pictureList: state.pictureList,
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "save-document":
            if (!state) {
                return undefined
            }

            if (state.id && state.hasChanges) {
                DocumentDatabase.updateDocument(state.id, state.name, state.pictureList)
                    .then(() => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        action.payload(state.id!)
                    })

                return {
                    ...state,
                    hasChanges: false,
                }
            } else if (state.pictureList.length > 0 && state.hasChanges) {
                DocumentDatabase.insertDocument(state.name, state.pictureList)
                    .then(([documentResultSet, _]) => {
                        action.payload(documentResultSet.insertId)
                    })

                return {
                    ...state,
                    hasChanges: false,
                }
            }

            return {
                ...state,
            }
        case "save-and-close-document":
            if (!state) {
                return undefined
            }

            if (state.id && state.hasChanges) {
                DocumentDatabase.updateDocument(state.id, state.name, state.pictureList)
            } else if (state.pictureList.length > 0 && state.hasChanges) {
                DocumentDatabase.insertDocument(state.name, state.pictureList)
            }

            return undefined
        case "close-document":
            return undefined
        default:
            throw new Error("Unknown action type")
    }
}


const DocumentDataContext = createContext([
    undefined,
    (value: DocumentDataReducerAction) => {}
] as DocumentDataContextType)

export const DocumentDataProvider = DocumentDataContext.Provider

export function useDocumentData() {
    return useContext(DocumentDataContext)
}

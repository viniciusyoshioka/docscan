import { createContext, useContext } from "react"
import { Alert } from "react-native"
import RNFS from "react-native-fs"
import {v4 as uuid4} from "uuid"

import { DocumentDatabase } from "../database"
import { Document, DocumentDataContextType, DocumentDataReducerAction } from "../types"
import { fullPathPicture } from "./constant"
import { getTimestamp } from "./date"
import { log } from "./log"


/**
 * @returns a string with the default name of the new document
 */
export function getDocumentName(): string {
    return "Novo documento"
}


/**
 * Get a new path for an image. The file will be
 * in the pictures folder and renamed using UUID v4
 * 
 * @param imagePath string with image file name or path
 * 
 * @returns string of the new image path
 */
export async function getDocumentPicturePath(imagePath: string): Promise<string> {
    const fileName = uuid4()
    const splittedImagePath = imagePath.split(".")
    const fileExtension = splittedImagePath[splittedImagePath.length - 1]

    let newPath = `${fullPathPicture}/${fileName}.${fileExtension}`
    while (await RNFS.exists(newPath)) {
        const newFileName = uuid4()
        newPath = `${fullPathPicture}/${newFileName}.${fileExtension}`
    }
    return newPath
}


/**
 * Reducer function to handle with document data actions
 * and update its state
 */
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
                    .catch((error) => {
                        log.error(`Error saving (update) document in action ${action.type}. "${error}"`)
                        Alert.alert(
                            "Aviso",
                            "Erro salvando documento"
                        )
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
                    .catch((error) => {
                        log.error(`Error saving (insert) document in action ${action.type}. "${error}"`)
                        Alert.alert(
                            "Aviso",
                            "Erro salvando documento"
                        )
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
                    .catch((error) => {
                        log.error(`Error saving (update) document in action ${action.type}. "${error}"`)
                        Alert.alert(
                            "Aviso",
                            "Erro salvando documento"
                        )
                    })
            } else if (state.pictureList.length > 0 && state.hasChanges) {
                DocumentDatabase.insertDocument(state.name, state.pictureList)
                    .catch((error) => {
                        log.error(`Error saving (insert) document in action ${action.type}. "${error}"`)
                        Alert.alert(
                            "Aviso",
                            "Erro salvando documento"
                        )
                    })
            }

            return undefined
        case "close-document":
            return undefined
        default:
            throw new Error("Unknown action type")
    }
}


const DocumentDataContext = createContext({
    documentDataState: undefined,
    dispatchDocumentData: (value: DocumentDataReducerAction) => {}
} as DocumentDataContextType)

/**
 * Provider to pass the document data through the component tree
 */
export const DocumentDataProvider = DocumentDataContext.Provider

/**
 * Hook to get document data state and dispatch
 */
export function useDocumentData() {
    return useContext(DocumentDataContext)
}

import { createContext, useContext } from "react"
import { Alert } from "react-native"
import RNFS from "react-native-fs"
import "react-native-get-random-values"
import { v4 as uuid4 } from "uuid"

import { DocumentDatabase } from "../database"
import { translate } from "../locales"
import { Document, DocumentDataContextType, DocumentDataReducerAction } from "../types"
import { fullPathPicture, fullPathTemporaryExported } from "./constant"
import { getTimestamp } from "./date"
import { log, stringfyError } from "./log"


/**
 * Gets the default name of a new document
 *
 * @returns a string with the default name of the new document
 */
export function getDocumentName(): string {
    return translate("document_newDocumentName")
}


/**
 * Get the file name with the extension from a file path
 *
 * @param filePath string of the file path
 *
 * @returns string of the full file name
 */
export function getFullFileName(filePath: string): string {
    const splittedFilePath = filePath.split("/")
    return splittedFilePath[splittedFilePath.length - 1]
}


/**
 * Get the extenstion of the given file name or file path
 *
 * @param filePath string of the file name or file path
 *
 * @returns string of the file extension
 */
export function getFileExtension(filePath: string): string {
    const splittedFilePath = filePath.split(".")
    return splittedFilePath[splittedFilePath.length - 1]
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
    const fileExtension = getFileExtension(imagePath)

    let newPath = `${fullPathPicture}/${fileName}.${fileExtension}`
    while (await RNFS.exists(newPath)) {
        const newFileName = uuid4()
        newPath = `${fullPathPicture}/${newFileName}.${fileExtension}`
    }
    return newPath
}


/**
 * Get the path for an exported document picture. The file
 * will be in the temporary exported folder.
 *
 * @param imagePath string with image file path
 *
 * @returns string of the new image path
 */
export async function getPictureTemporaryExportPath(imagePath: string): Promise<string> {
    const fileName = getFullFileName(imagePath)

    return `${fullPathTemporaryExported}/${fileName}`
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
                    .filter((_, index) => !action.payload.includes(index))
                    .map((item, index) => ({
                        ...item,
                        position: index,
                    })),
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "replace-picture":
            if (!state) {
                return undefined
            }

            state.pictureList[action.payload.indexToReplace].filePath = action.payload.newPicturePath
            state.pictureList[action.payload.indexToReplace].fileName = action.payload.newPictureName
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
                    .catch(error => {
                        log.error(`Error saving, to update, document with action ${action.type}. "${stringfyError(error)}"`)
                        Alert.alert(
                            translate("warn"),
                            translate("document_alert_errorSavingDocument_text")
                        )
                    })

                return {
                    ...state,
                    hasChanges: false,
                }
            } else if (state.pictureList.length > 0 && state.hasChanges) {
                DocumentDatabase.insertDocument(state.name, state.pictureList)
                    .then(insertedDocumentId => {
                        action.payload(insertedDocumentId)
                    })
                    .catch(error => {
                        log.error(`Error saving, to insert, document with action ${action.type}. "${stringfyError(error)}"`)
                        Alert.alert(
                            translate("warn"),
                            translate("document_alert_errorSavingDocument_text")
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
                    .catch(error => {
                        log.error(`Error saving, to update, document with action ${action.type}. "${stringfyError(error)}"`)
                        Alert.alert(
                            translate("warn"),
                            translate("document_alert_errorSavingDocument_text")
                        )
                    })
            } else if (state.pictureList.length > 0 && state.hasChanges) {
                DocumentDatabase.insertDocument(state.name, state.pictureList)
                    .catch(error => {
                        log.error(`Error saving, to insert, document with action ${action.type}. "${stringfyError(error)}"`)
                        Alert.alert(
                            translate("warn"),
                            translate("document_alert_errorSavingDocument_text")
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
 * Hook to get document data state and the dispatch function
 */
export function useDocumentData() {
    return useContext(DocumentDataContext)
}

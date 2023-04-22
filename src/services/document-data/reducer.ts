/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Alert } from "react-native"

import { DocumentDatabase } from "../../database"
import { translate } from "../../locales"
import { Document } from "../../types"
import { getTimestamp } from "../date"
import { getDocumentName } from "../document"
import { log, stringfyError } from "../log"
import { DocumentDataReducerAction } from "./types"


// TODO restaure document when there is an error on save
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
            if (!state) return {
                id: undefined,
                name: getDocumentName(),
                pictureList: [],
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }

            return { ...state }
        case "rename-document":
            if (!state) return {
                id: undefined,
                name: action.payload,
                pictureList: [],
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }

            return {
                ...state,
                name: action.payload,
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "add-picture":
            if (!state) return {
                id: undefined,
                name: getDocumentName(),
                pictureList: [...action.payload],
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }

            return {
                ...state,
                pictureList: [...state.pictureList, ...action.payload],
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "remove-picture":
            if (!state) return undefined

            return {
                ...state,
                pictureList: state.pictureList
                    .filter((_, index) => !action.payload.includes(index))
                    .map((item, index) => ({ ...item, position: index })),
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "replace-picture":
            if (!state) return undefined

            state.pictureList[action.payload.indexToReplace].filePath = action.payload.newPicturePath
            state.pictureList[action.payload.indexToReplace].fileName = action.payload.newPictureName
            return {
                ...state,
                pictureList: state.pictureList,
                lastModificationTimestamp: getTimestamp(),
                hasChanges: true,
            }
        case "save-document":
            if (!state) return undefined

            if (state.id && state.hasChanges) {
                DocumentDatabase.updateDocument(state.id, state.name, state.pictureList)
                    .then(() => action.payload(state.id!))
                    .catch(error => {
                        log.error(`Error saving, to update, document with action ${action.type}. "${stringfyError(error)}"`)
                        Alert.alert(
                            translate("warn"),
                            translate("document_alert_errorSavingDocument_text")
                        )
                    })

                return { ...state, hasChanges: false }
            } else if (state.pictureList.length > 0 && state.hasChanges) {
                DocumentDatabase.insertDocument(state.name, state.pictureList)
                    .then(insertedDocumentId => action.payload(insertedDocumentId))
                    .catch(error => {
                        log.error(`Error saving, to insert, document with action ${action.type}. "${stringfyError(error)}"`)
                        Alert.alert(
                            translate("warn"),
                            translate("document_alert_errorSavingDocument_text")
                        )
                    })

                return { ...state, hasChanges: false }
            }

            return { ...state }
        case "save-and-close-document":
            if (!state) return undefined

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

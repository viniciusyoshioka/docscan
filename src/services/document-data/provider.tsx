import { createContext, ProviderProps, useContext, useEffect } from "react"
import { Alert } from "react-native"

import { DocumentDatabase } from "../../database"
import { translate } from "../../locales"
import { log, stringfyError } from "../log"
import { documentDataDefault } from "./constants"
import { DocumentDataContextValue } from "./types"


const DocumentDataContext = createContext<DocumentDataContextValue>(documentDataDefault)


export function DocumentDataProvider(props: ProviderProps<DocumentDataContextValue>) {


    function saveChanges() {
        if (!props.value.documentDataState?.hasChanges) {
            return
        }

        props.value.dispatchDocumentData({
            type: "save-document",
            payload: async (documentId: number) => {
                try {
                    const document = await DocumentDatabase.getDocument(documentId)
                    const documentPicture = await DocumentDatabase.getDocumentPicture(documentId)

                    props.value.dispatchDocumentData({
                        type: "set-document",
                        payload: {
                            document: {
                                id: documentId,
                                ...document,
                            },
                            pictureList: documentPicture,
                        },
                    })
                } catch (error) {
                    log.error(`Error getting document and document pictures from database while saving changes: "${stringfyError(error)}"`)
                    Alert.alert(
                        translate("warn"),
                        translate("document_alert_errorSavingDocumentChanges_text")
                    )
                }
            },
        })
    }


    useEffect(() => {
        saveChanges()
    }, [props.value.documentDataState])


    return <DocumentDataContext.Provider {...props} />
}


export function useDocumentData() {
    return useContext(DocumentDataContext)
}

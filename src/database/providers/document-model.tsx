import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"

import { DocumentModelAction, DocumentModelActionType, DocumentModelState, documentModelReducer } from "../models"


export interface DocumentModelContextValue {
    documentModel: DocumentModelState | undefined;
    setDocumentModel: Dispatch<DocumentModelAction<DocumentModelActionType>>;
}


const DocumentModelContext = createContext<DocumentModelContextValue>({
    documentModel: undefined,
    setDocumentModel: () => {},
})


export interface DocumentModelProviderProps {
    children?: ReactNode;
}


export function DocumentModelProvider(props: DocumentModelProviderProps) {

    const [documentModel, setDocumentModel] = useReducer(documentModelReducer, undefined)

    return (
        <DocumentModelContext.Provider
            value={{ documentModel, setDocumentModel }}
            children={props.children}
        />
    )
}


export function useDocumentModel() {
    return useContext(DocumentModelContext)
}

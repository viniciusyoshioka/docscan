import { Realm } from "@realm/react"
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react"

import { DocumentPictureSchema, DocumentSchema } from "../schemas"


export interface DocumentModelValue {
  document: DocumentSchema
  pictures: Realm.Results<DocumentPictureSchema>
}


export interface DocumentModelContextValue {
  documentModel: DocumentModelValue | undefined
  setDocumentModel: Dispatch<SetStateAction<DocumentModelValue | undefined>>
}


const DocumentModelContext = createContext<DocumentModelContextValue>({
  documentModel: undefined,
  setDocumentModel: () => {},
})


export interface DocumentModelProviderProps {
  children?: ReactNode
}


export function DocumentModelProvider(props: DocumentModelProviderProps) {

  const [documentModel, setDocumentModel] = useState<DocumentModelValue | undefined>()

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

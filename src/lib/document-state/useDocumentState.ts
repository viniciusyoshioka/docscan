import { useStore } from "zustand"

import { DocumentStateActions, DocumentStateData } from "./reducer"
import { documentStore } from "./store"


export type DocumentState = {
  documentState: DocumentStateData | null
  updateDocumentState: (args: DocumentStateActions) => void
}


export function useDocumentState(): DocumentState {

  const { state, dispatch } = useStore(documentStore)

  return {
    documentState: state,
    updateDocumentState: dispatch,
  }
}

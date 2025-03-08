import { create } from "zustand"

import { DocumentStateActions, DocumentStateData, documentStateReducer } from "./reducer"


type DocumentStore = {
  state: DocumentStateData | null
  dispatch: (args: DocumentStateActions) => void
}


export const documentStore = create<DocumentStore>()(set => ({
  state: null,
  dispatch: args => set(state => ({
    state: documentStateReducer(state.state, args),
  })),
}))

import { create } from "zustand"

import { createDefaultDocumentState, createDefaultPicturesState } from "./default"
import { DocumentStateActions, DocumentStateData } from "./reducer"
import { documentStateReducer } from "./reducer/reducer"


export type DocumentStore = {
  state: DocumentStateData | null
  dispatch: (args: DocumentStateActions) => void
}


export const documentStore = create<DocumentStore>()(set => ({
  state: {
    document: createDefaultDocumentState(),
    pictures: createDefaultPicturesState(),
  },
  dispatch: args => set(state => ({
    state: documentStateReducer(state.state, args),
  })),
}))

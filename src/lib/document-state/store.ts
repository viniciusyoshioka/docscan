import { create } from "zustand"

import { defaultDocument, defaultPictures } from "./default"
import { DocumentStateActions, DocumentStateData } from "./reducer"
import { documentStateReducer } from "./reducer/reducer"


export type DocumentStore = {
  state: DocumentStateData | null
  dispatch: (args: DocumentStateActions) => void
}


export const documentStore = create<DocumentStore>()(set => ({
  state: {
    document: defaultDocument,
    pictures: defaultPictures,
  },
  dispatch: args => set(state => ({
    state: documentStateReducer(state.state, args),
  })),
}))

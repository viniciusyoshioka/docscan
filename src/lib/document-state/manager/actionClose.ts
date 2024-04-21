import { DocumentManagerActionFunction } from "./types"


export const close: DocumentManagerActionFunction<"close"> =
  (commonParams, specificParams) => {


    const { updateDocumentState } = commonParams


    updateDocumentState({
      type: "close",
      payload: undefined,
    })
  }

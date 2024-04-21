import { DocumentManagerActionFunction } from "./types"


export const open: DocumentManagerActionFunction<"open"> =
  (commonParams, specificParams) => {


    const { documentModel, documentPictureModel } = commonParams
    const { updateDocumentState } = commonParams
    const { documentId } = specificParams


    const document = documentModel.select(documentId)
    const pictures = documentPictureModel.selectAllForDocument(documentId, {
      orderBy: {
        position: "asc",
      },
    })


    updateDocumentState({
      type: "set",
      payload: {
        document,
        pictures,
      },
    })
  }

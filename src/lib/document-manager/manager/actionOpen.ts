import { DocumentManagerActionFunction } from "./types"


export const actionOpen: DocumentManagerActionFunction<"open"> =
  async (commonParams, specificParams) => {


    const { documentModel, pictureModel } = commonParams
    const { documentId } = specificParams


    const document = await documentModel.select(documentId)
    const pictures = await pictureModel.selectAllForDocument(documentId, {
      orderBy: {
        position: "asc",
      },
    })


    return {
      document,
      pictures,
    }
  }

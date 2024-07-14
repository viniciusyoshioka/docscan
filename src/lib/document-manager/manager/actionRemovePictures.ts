import { DocumentManagerActionFunction } from "./types"


// TODO implement transactions
export const actionRemovePictures: DocumentManagerActionFunction<"removePictures"> =
  async (commonParams, specificParams) => {


    const { documentModel, pictureModel } = commonParams
    const { document, picturesId } = specificParams


    await pictureModel.deleteMultiple(picturesId)

    document.updatedAt = Date.now()
    const updatedDocument = await documentModel.update(document)


    return {
      document: updatedDocument,
    }
  }

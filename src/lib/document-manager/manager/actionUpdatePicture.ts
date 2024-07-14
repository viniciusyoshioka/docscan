import { DocumentManagerActionFunction } from "./types"


// TODO implement transactions
export const actionUpdatePicture: DocumentManagerActionFunction<"updatePicture"> =
  async (commonParams, specificParams) => {


    const { documentModel, pictureModel } = commonParams
    const { document, picture } = specificParams


    const updatedPicture = await pictureModel.update(picture)

    document.updatedAt = Date.now()
    const updatedDocument = await documentModel.update(document)


    return {
      document: updatedDocument,
      updatedPicture: updatedPicture,
    }
  }

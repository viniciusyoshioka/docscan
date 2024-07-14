import { Document, WithId } from "@database"
import { DocumentManagerActionFunction } from "./types"


export const actionUpdateDocument: DocumentManagerActionFunction<"updateDocument"> =
  async (commonParams, specificParams) => {


    const { documentModel } = commonParams
    const { document } = specificParams


    const updatedDocument = (document.id === undefined)
      ? await documentModel.insert(document as Document)
      : await documentModel.update(document as WithId<Document>)


    return {
      document: updatedDocument,
    }
  }

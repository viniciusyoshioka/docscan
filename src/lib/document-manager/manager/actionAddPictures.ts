import { Document, Picture, WithId } from "@database"
import { DocumentService } from "@services/document"
import { DocumentManagerActionFunction } from "./types"


type ActionReturnType = ReturnType<DocumentManagerActionFunction<"addPictures">>


// TODO implement transactions
export const actionAddPictures: DocumentManagerActionFunction<"addPictures"> =
  async (commonParams, specificParams) => {


    const { documentModel, pictureModel } = commonParams
    const { document, picturesPath } = specificParams


    async function addPicturesIfDocumentIsNotSaved(): Promise<ActionReturnType> {
      const newDocument = await documentModel.insert(document as Document)

      const newPictures = await pictureModel.insertMultiple(
        picturesPath.map<Picture>((item, index) => ({
          fileName: DocumentService.getFileFullname(item),
          position: index,
          belongsTo: newDocument.id,
        }))
      )

      return {
        document: newDocument,
        addedPictures: newPictures,
      }
    }

    async function addPicturesIfDocumentIsSaved(): Promise<ActionReturnType> {
      const currentDocument = document as WithId<Document>

      const currentPicturesCount = await pictureModel.count(currentDocument.id)
      const newPictures = await pictureModel.insertMultiple(
        picturesPath.map<Picture>((item, index) => ({
          fileName: DocumentService.getFileFullname(item),
          position: currentPicturesCount + index,
          belongsTo: currentDocument.id,
        }))
      )

      currentDocument.updatedAt = Date.now()
      const updatedDocument = await documentModel.update(currentDocument)

      return {
        document: updatedDocument,
        addedPictures: newPictures,
      }
    }


    return (document.id === undefined)
      ? await addPicturesIfDocumentIsNotSaved()
      : await addPicturesIfDocumentIsSaved()
  }

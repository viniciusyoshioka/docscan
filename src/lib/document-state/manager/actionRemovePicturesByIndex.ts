import { Document, WithId } from "@database"
import { DocumentNotOpenError, DocumentNotSavedError } from "../errors"
import { DocumentManagerActionFunction } from "./types"


type ActionFunctionAlias = DocumentManagerActionFunction<"removePicturesByIndex">


export const removePicturesByIndex: ActionFunctionAlias =
  (commonParams, specificParams) => {


    const { documentModel, documentPictureModel } = commonParams
    const { documentState, updateDocumentState } = commonParams
    const { picturesIndex } = specificParams


    if (!documentState) {
      throw new DocumentNotOpenError("Document must be opened before removing pictures")
    }
    if (documentState.document.id === undefined) {
      throw new DocumentNotSavedError(
        "Document should not have pictures without being saved first. This is a bug."
      )
    }


    const currentDocument = documentState.document as WithId<Document>
    const currentPictures = documentState.pictures


    const picturesIdToRemove = picturesIndex.map(index => currentPictures[index].id)
    documentPictureModel.deleteMultiple(picturesIdToRemove)

    currentDocument.modifiedAt = Date.now()
    documentModel.update(currentDocument)

    const newPictures = documentPictureModel.selectAllForDocument(currentDocument.id, {
      orderBy: {
        position: "asc",
      },
    })


    updateDocumentState({
      type: "set",
      payload: {
        document: currentDocument,
        pictures: newPictures,
      },
    })
  }

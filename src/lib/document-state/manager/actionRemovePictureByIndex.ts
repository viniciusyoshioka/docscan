import { Document, WithId } from "@database"
import { DocumentNotOpenError, DocumentNotSavedError } from "../errors"
import { DocumentManagerActionFunction } from "./types"


export const removePictureByIndex: DocumentManagerActionFunction<"removePictureByIndex"> =
  (commonParams, specificParams) => {


    const { documentModel, documentPictureModel } = commonParams
    const { documentState, updateDocumentState } = commonParams
    const { pictureIndex } = specificParams


    if (!documentState) {
      throw new DocumentNotOpenError("Document must be opened before removing a picture")
    }
    if (documentState.document.id === undefined) {
      throw new DocumentNotSavedError(
        "Document should not have a picture without being saved first. This is a bug."
      )
    }


    const currentDocument = documentState.document as WithId<Document>
    const currentPictures = documentState.pictures


    const pictureIdToRemove = currentPictures[pictureIndex].id
    documentPictureModel.delete(pictureIdToRemove)

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

import { Document, WithId } from "@database"
import { DocumentNotOpenError, DocumentNotSavedError } from "../errors"
import { DocumentManagerActionFunction } from "./types"


export const updatePicture: DocumentManagerActionFunction<"updatePicture"> =
  (commonParams, specificParams) => {


    const { documentModel, documentPictureModel } = commonParams
    const { documentState, updateDocumentState } = commonParams
    const { picture, pictureIndex } = specificParams


    if (!documentState) {
      throw new DocumentNotOpenError("Document must be opened before updating a picture")
    }
    if (documentState.document.id === undefined) {
      throw new DocumentNotSavedError(
        "Document should not have a picture without being saved first. This is a bug."
      )
    }


    const currentDocument = documentState.document as WithId<Document>


    documentPictureModel.update(picture)

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

import { Document, WithId } from "@database"
import { defaultDocument, defaultPictures } from "../default"
import { DocumentManagerActionFunction } from "./types"


export const updateDocument: DocumentManagerActionFunction<"updateDocument"> =
  (commonParams, specificParams) => {


    const { documentModel } = commonParams
    const { documentState, updateDocumentState } = commonParams
    const { document } = specificParams


    const currentDocument = documentState ? documentState.document : defaultDocument
    const currentPictures = documentState ? documentState.pictures : defaultPictures


    function updateNotSavedDocument() {
      const newDocument = documentModel.insert(document as Document)

      updateDocumentState({
        type: "set",
        payload: {
          document: newDocument,
          pictures: currentPictures,
        },
      })
    }

    function updateSavedDocument() {
      const updatedDocument = documentModel.update(document as WithId<Document>)

      updateDocumentState({
        type: "set",
        payload: {
          document: updatedDocument,
          pictures: currentPictures,
        },
      })
    }


    if (currentDocument.id === undefined) {
      updateNotSavedDocument()
    } else {
      updateSavedDocument()
    }
  }

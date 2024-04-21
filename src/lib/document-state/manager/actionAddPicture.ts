import { Document, WithId } from "@database"
import { DocumentService } from "@services/document"
import { defaultDocument, defaultPictures } from "../default"
import { DocumentManagerActionFunction } from "./types"


export const addPicture: DocumentManagerActionFunction<"addPicture"> =
  (commonParams, specificParams) => {


    const { documentModel, documentPictureModel } = commonParams
    const { documentState, updateDocumentState } = commonParams
    const { picturePath } = specificParams


    const currentDocument = documentState ? documentState.document : defaultDocument
    const currentPictures = documentState ? documentState.pictures : defaultPictures


    function addPictureIfDocumentIsNotSaved() {
      const newDocument = documentModel.insert(currentDocument as Document)
      const newPicture = documentPictureModel.insert({
        fileName: DocumentService.getFileFullname(picturePath),
        position: currentPictures.length,
        belongsTo: newDocument.id,
      })

      updateDocumentState({
        type: "set",
        payload: {
          document: newDocument,
          pictures: [newPicture],
        },
      })
    }

    function addPictureIfDocumentIsSaved() {
      const newPicture = documentPictureModel.insert({
        fileName: DocumentService.getFileFullname(picturePath),
        position: currentPictures.length,
        belongsTo: (currentDocument as WithId<Document>).id,
      })

      currentDocument.modifiedAt = Date.now()
      documentModel.update(currentDocument as WithId<Document>)

      currentPictures.push(newPicture)
      updateDocumentState({
        type: "set",
        payload: {
          document: currentDocument as WithId<Document>,
          pictures: currentPictures,
        },
      })
    }


    if (currentDocument.id === undefined) {
      addPictureIfDocumentIsNotSaved()
    } else {
      addPictureIfDocumentIsSaved()
    }
  }

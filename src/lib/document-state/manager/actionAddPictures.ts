import { Document, DocumentPicture, WithId } from "@database"
import { DocumentService } from "@services/document"
import { defaultDocument, defaultPictures } from "../default"
import { DocumentManagerActionFunction } from "./types"


export const addPictures: DocumentManagerActionFunction<"addPictures"> =
  (commonParams, specificParams) => {


    const { documentModel, documentPictureModel } = commonParams
    const { documentState, updateDocumentState } = commonParams
    const { picturesPath } = specificParams


    const currentDocument = documentState ? documentState.document : defaultDocument
    const currentPictures = documentState ? documentState.pictures : defaultPictures


    function addPicturesIfDocumentIsNotSaved() {
      const newDocument = documentModel.insert(currentDocument as Document)

      const picturesToInsert = picturesPath.map<DocumentPicture>((item, index) => ({
        fileName: DocumentService.getFileFullname(item),
        position: index,
        belongsTo: newDocument.id,
      }))
      const newPictures = documentPictureModel.insertMultiple(picturesToInsert)

      updateDocumentState({
        type: "set",
        payload: {
          document: newDocument,
          pictures: newPictures,
        },
      })
    }

    function addPicturesIfDocumentIsSaved() {
      const picturesToInsert = picturesPath.map<DocumentPicture>((item, index) => ({
        fileName: DocumentService.getFileFullname(item),
        position: currentPictures.length + index,
        belongsTo: (currentDocument as WithId<Document>).id,
      }))
      const newPictures = documentPictureModel.insertMultiple(picturesToInsert)

      currentDocument.modifiedAt = Date.now()
      documentModel.update(currentDocument as WithId<Document>)

      currentPictures.push(...newPictures)
      updateDocumentState({
        type: "set",
        payload: {
          document: currentDocument as WithId<Document>,
          pictures: currentPictures,
        },
      })
    }


    if (currentDocument.id === undefined) {
      addPicturesIfDocumentIsNotSaved()
    } else {
      addPicturesIfDocumentIsSaved()
    }
  }

import { Document, DocumentPicture, IdOf, WithId, useDatabase } from "@database"
import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { DocumentService } from "@services/document"


export type DeleteSelectedPicturesFunction = () => void


export function useDeleteSelectedPictures(
  selectedIds: IdOf<DocumentPicture>[]
): DeleteSelectedPicturesFunction {


  const { documentModel, documentPictureModel } = useDatabase()
  const { documentState } = useDocumentState()
  const { document } = documentState as DocumentStateData


  function deleteSelectedPictures() {
    const picturesPath: string[] = []

    for (const id of selectedIds) {
      const picture = documentPictureModel.select(id)
      const picturePath = DocumentService.getPicturePath(picture.fileName)
      picturesPath.push(picturePath)
      documentPictureModel.delete(id)
    }

    const updatedDocument = { ...document as WithId<Document> }
    updatedDocument.modifiedAt = Date.now()
    documentModel.update(updatedDocument)

    DocumentService.deletePicturesService({
      pictures: picturesPath,
    })
  }


  return deleteSelectedPictures
}

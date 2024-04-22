import { IdOf, useDatabase } from "@database"
import { DocumentService } from "@services/document"


// TODO change implementation to use have better atomicity
// TODO change implementation to handle file deletion properly
export function useDeleteSelectedDocuments(selectedIds: IdOf<Document>[]): () => void {


  const { documentModel, documentPictureModel } = useDatabase()


  function deleteSelectedDocuments() {
    for (const id of selectedIds) {
      const pictures = documentPictureModel.selectAllForDocument(id)
      const picturesId = pictures.map(picture => picture.id)
      const picturesPath = pictures.map(picture => (
        DocumentService.getPicturePath(picture.fileName)
      ))

      documentPictureModel.deleteMultiple(picturesId)
      documentModel.deleteMultiple(selectedIds)
      DocumentService.deletePicturesService({
        pictures: picturesPath,
      })
    }
  }


  return deleteSelectedDocuments
}

import { Document, DocumentPicture } from "../../entities"
import { IdOf, QueryOptions, WithId } from "../../types"


export interface IDocumentPictureModel {
  select(id: IdOf<DocumentPicture>): WithId<DocumentPicture>
  selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<DocumentPicture>
  ): WithId<DocumentPicture>[]

  insert(picture: DocumentPicture): WithId<DocumentPicture>
  insertMultiple(pictures: DocumentPicture[]): WithId<DocumentPicture>[]

  update(picture: WithId<DocumentPicture>): WithId<DocumentPicture>

  delete(id: IdOf<DocumentPicture>): void
  deleteMultiple(ids: IdOf<DocumentPicture>[]): void
}

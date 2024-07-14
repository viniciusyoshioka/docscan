import { Document, Picture } from "../../entities"
import { IdOf, QueryOptions, WithId } from "../../types"


export interface IPictureModel {
  count(documentId: IdOf<Document>): Promise<number>

  select(id: IdOf<Picture>): Promise<WithId<Picture>>
  selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<Picture>
  ): Promise<WithId<Picture>[]>

  insert(picture: Picture): Promise<WithId<Picture>>
  insertMultiple(pictures: Picture[]): Promise<WithId<Picture>[]>

  update(picture: WithId<Picture>): Promise<WithId<Picture>>

  delete(id: IdOf<Picture>): Promise<void>
  deleteMultiple(ids: IdOf<Picture>[]): Promise<void>
}

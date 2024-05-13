import { Document, Picture } from "../../entities"
import { IdOf, QueryOptions, WithId } from "../../types"


export interface IPictureModel {
  select(id: IdOf<Picture>): WithId<Picture>
  selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<Picture>
  ): WithId<Picture>[]

  insert(picture: Picture): WithId<Picture>
  insertMultiple(pictures: Picture[]): WithId<Picture>[]

  update(picture: WithId<Picture>): WithId<Picture>

  delete(id: IdOf<Picture>): void
  deleteMultiple(ids: IdOf<Picture>[]): void
}

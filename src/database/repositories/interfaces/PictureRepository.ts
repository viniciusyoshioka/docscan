import { Document, Picture } from "../../entities"
import { IdOf, QueryOptions, WithId } from "../../types"


export interface PictureRepository {
  select(id: IdOf<Picture>): Promise<WithId<Picture>>
  selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<Picture>
  ): Promise<WithId<Picture>[]>

  insert(picture: Picture): Promise<WithId<Picture>>
  update(picture: WithId<Picture>): Promise<WithId<Picture>>
  delete(id: IdOf<Picture>): Promise<void>
}

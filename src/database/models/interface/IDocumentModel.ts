import { Document } from "../../entities"
import { IdOf, QueryOptions, WithId } from "../../types"


export interface IDocumentModel {
  select(id: IdOf<Document>): Promise<WithId<Document>>
  selectAll(options?: QueryOptions<Document>): Promise<WithId<Document>[]>
  insert(document: Document): Promise<WithId<Document>>
  update(document: WithId<Document>): Promise<WithId<Document>>
  delete(id: IdOf<Document>): Promise<void>
  deleteMultiple(ids: IdOf<Document>[]): Promise<void>
}

import { Document } from "../../entities"
import { IdOf, QueryOptions, WithId } from "../../types"


export interface IDocumentRepository {
  select(id: IdOf<Document>): WithId<Document>
  selectAll(options?: QueryOptions<Document>): WithId<Document>[]
  insert(document: Document): WithId<Document>
  update(document: WithId<Document>): WithId<Document>
  delete(id: IdOf<Document>): void
}

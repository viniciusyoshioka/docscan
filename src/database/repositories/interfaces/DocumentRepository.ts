import { Document } from "../../entities"
import { QueryOptions, WithId } from "../../types"


export interface IDocumentRepository {
  select(id: WithId<Document>["id"]): WithId<Document>
  selectAll(options?: QueryOptions<Document>): WithId<Document>[]
  insert(document: Document): WithId<Document>
  update(document: WithId<Document>): WithId<Document>
  delete(id: WithId<Document>["id"]): void
}

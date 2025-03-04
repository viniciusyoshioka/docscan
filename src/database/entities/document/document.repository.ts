import { EntityManager, Repository } from "typeorm"

import { GetDocumentsPaginatedBO } from "./bo"
import { DocumentEntity } from "./document.entity"


export interface DocumentRepository {
  transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T>
  getDocumentsPaginated(options?: GetDocumentsPaginatedBO): Promise<DocumentEntity[]>
}


type CustomDocumentRepository = ThisType<Repository<DocumentEntity>> & DocumentRepository


export const customDocumentRepository: CustomDocumentRepository = {


  async transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.manager.transaction(query)
  },


  async getDocumentsPaginated(options?: GetDocumentsPaginatedBO): Promise<DocumentEntity[]> {
    const { limit = 10, offset = 0 } = options ?? {}

    return await this.find({
      order: {
        updatedAt: "desc",
      },
      take: limit,
      skip: offset,
    })
  },
}

import { Repository } from "typeorm"

import { GetDocumentsPaginatedBO } from "./bo"
import { DocumentEntity } from "./document.entity"


export interface DocumentRepository {
  getDocumentsPaginated(options?: GetDocumentsPaginatedBO): Promise<DocumentEntity[]>
}


type CustomDocumentRepository = ThisType<Repository<DocumentEntity>> & DocumentRepository


export const customDocumentRepository: CustomDocumentRepository = {
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

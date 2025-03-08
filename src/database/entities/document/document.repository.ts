import { EntityManager, Repository } from "typeorm"

import { EntityNotFoundError } from "../../errors"
import { EntityId } from "../../types"
import { CreateDocumentBO, GetDocumentsPaginatedBO } from "./bo"
import { DocumentEntity } from "./document.entity"


export interface DocumentRepository {
  transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T>
  getDocumentsPaginated(options?: GetDocumentsPaginatedBO): Promise<DocumentEntity[]>
  createDocument(createBo: CreateDocumentBO): Promise<DocumentEntity>
  updateDocumentLastUpdateDate(id: EntityId): Promise<DocumentEntity>
  updateDocumentName(id: EntityId, newName: string): Promise<DocumentEntity>
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

  async createDocument(createBo: CreateDocumentBO): Promise<DocumentEntity> {
    return await this.save(createBo)
  },

  async updateDocumentLastUpdateDate(id: EntityId): Promise<DocumentEntity> {
    const existingDocument = await this.findOne({
      where: { id },
    })
    if (!existingDocument) {
      throw new EntityNotFoundError(`Document not found with id: ${id}`)
    }

    existingDocument.updatedAt = new Date()

    return await this.save(existingDocument)
  },

  async updateDocumentName(id: EntityId, newName: string): Promise<DocumentEntity> {
    const existingDocument = await this.findOne({
      where: { id },
    })
    if (!existingDocument) {
      throw new EntityNotFoundError(`Document not found with id: ${id}`)
    }

    existingDocument.name = newName
    existingDocument.updatedAt = new Date()

    return await this.save(existingDocument)
  },
}

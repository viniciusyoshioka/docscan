import { In } from 'typeorm'

import type { DocumentEntity, DocumentId } from '../../entities'
import type {
  CreateDocument,
  DocumentRepository,
  FindDocumentsPaginated,
} from '../../repositories'
import type { Paginated } from '../../types'
import { SortOrder } from '../../types'
import type { TypeOrmDocumentEntity } from '../entities'
import { BaseTypeOrmRepository } from './base-typeorm.repository.ts'


export class TypeOrmDocumentRepository
  extends BaseTypeOrmRepository<TypeOrmDocumentEntity>
  implements DocumentRepository {

  async findById(
    id: DocumentId,
  ): Promise<DocumentEntity | null> {
    return await this.findOne({
      where: {
        id,
      },
    })
  }

  async findPaginated(
    options: FindDocumentsPaginated,
  ): Promise<Paginated<DocumentEntity>> {
    const {
      page = 1,
      limit = 10,
      offset,
      sortBy = {
        updatedAt: SortOrder.DESC,
      },
    } = options

    const offsetToUse = offset ?? ((page - 1) * limit)

    const query = this.createQueryBuilder('documents')
      .limit(limit)
      .offset(offsetToUse)

    Object.entries(sortBy).forEach(([column, sortOrder]) => {
      query.addOrderBy(`documents.${column}`, sortOrder)
    })

    const [data, total] = await query.getManyAndCount()

    return {
      data,
      total,
    }
  }

  async createDocument(
    data: CreateDocument,
  ): Promise<DocumentEntity> {
    const now = Date.now()

    const documentToCreate = this.create({
      title: data.title,
      createdAt: now,
      updatedAt: now,
    })

    return await this.save(documentToCreate)
  }

  async updateDocument(
    newDocument: DocumentEntity,
  ): Promise<DocumentEntity> {
    const documentToUpdate = this.merge(
      newDocument,
      {
        updatedAt: Date.now(),
      },
    )

    return await this.save(documentToUpdate)
  }

  async deleteById(
    id: DocumentId,
  ): Promise<void> {
    await this.delete({
      id,
    })
  }

  async deleteByIds(
    ids: DocumentId[],
  ): Promise<void> {
    if (!ids.length) {
      return
    }

    await this.delete({
      id: In(ids),
    })
  }
}

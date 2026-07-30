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
      sortBy = {
        updatedAt: SortOrder.DESC,
      },
    } = options

    const offset = (page - 1) * limit

    const query = this.createQueryBuilder('documents')
      .limit(limit)
      .offset(offset)

    Object.entries(sortBy).forEach(([column, sortOrder]) => {
      query.addOrderBy(column, sortOrder)
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

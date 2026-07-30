import { merge } from 'lodash'

import type { Transaction } from '../../database'
import type { DocumentEntity, DocumentId } from '../../entities'
import type {
  CreateDocument,
  DocumentRepository,
  UpdateDocument,
} from '../../repositories'
import type { Paginated, SortBy } from '../../types'
import { SortOrder } from '../../types'
import { assertPaginationIsValid } from '../../utils'


export class DocumentService {


  constructor(
    private readonly documentRepository: DocumentRepository,
  ) {}


  async findById(
    id: DocumentId,
    transaction?: Transaction,
  ): Promise<DocumentEntity | null> {
    if (!transaction) {
      return await this.documentRepository.transaction(async tx => {
        return await this.findById(id, tx)
      })
    }

    const txDocumentRepository = this.documentRepository.withinTransaction(
      transaction,
    )

    return await txDocumentRepository.findById(id)
  }

  async findPaginated(
    options: {
      page?: number
      limit?: number
      sortBy?: SortBy<DocumentEntity>
    },
    transaction?: Transaction,
  ): Promise<Paginated<DocumentEntity>> {
    if (!transaction) {
      return await this.documentRepository.transaction(async tx => {
        return await this.findPaginated(options, tx)
      })
    }

    const {
      page = 1,
      limit = 10,
      sortBy = {
        updatedAt: SortOrder.DESC,
      },
    } = options

    assertPaginationIsValid({ page, limit })

    const txDocumentRepository = this.documentRepository.withinTransaction(
      transaction,
    )

    return await txDocumentRepository.findPaginated({
      page,
      limit,
      sortBy,
    })
  }

  async create(
    data: CreateDocument,
    transaction?: Transaction,
  ): Promise<DocumentEntity> {
    if (!transaction) {
      return await this.documentRepository.transaction(async tx => {
        return await this.create(data, tx)
      })
    }

    this.assertDocumentToCreateIsValid(data)

    const txDocumentRepository = this.documentRepository.withinTransaction(
      transaction,
    )

    const createdDocument = await txDocumentRepository.createDocument({
      title: data.title,
    })

    return createdDocument
  }

  private assertDocumentToCreateIsValid(
    data: CreateDocument,
  ): void {
    const { title } = data

    if (!title.length) {
      throw new Error('Document title cannot be empty')
    }
  }

  async update(
    id: DocumentId,
    newData: UpdateDocument,
    transaction?: Transaction,
  ): Promise<DocumentEntity> {
    if (!transaction) {
      return await this.documentRepository.transaction(async tx => {
        return await this.update(id, newData, tx)
      })
    }

    const txDocumentRepository = this.documentRepository.withinTransaction(
      transaction,
    )

    const existingDocument = await txDocumentRepository.findById(id)
    if (!existingDocument) {
      throw new Error(`Document (id: ${id}) was not found`)
    }

    const documentToUpdate = merge(
      existingDocument,
      newData,
    )

    this.assertDocumentToUpdateIsValid(documentToUpdate)

    const updatedDocument = await txDocumentRepository.updateDocument(
      documentToUpdate,
    )

    return updatedDocument
  }

  private assertDocumentToUpdateIsValid(
    documentToUpdate: DocumentEntity,
  ): void {
    const { title } = documentToUpdate

    if (!title.length) {
      throw new Error('Document title cannot be empty')
    }
  }

  async deleteByIds(
    ids: DocumentId[],
    transaction?: Transaction,
  ): Promise<void> {
    if (!ids.length) {
      return
    }

    if (!transaction) {
      await this.documentRepository.transaction(async tx => {
        await this.deleteByIds(ids, tx)
      })
      return
    }

    const txDocumentRepository = this.documentRepository.withinTransaction(
      transaction,
    )

    await txDocumentRepository.deleteByIds(ids)
  }
}

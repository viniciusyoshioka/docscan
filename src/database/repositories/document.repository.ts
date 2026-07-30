import type { DocumentEntity, DocumentId } from '../entities'
import type { Paginated, Pagination, SortBy } from '../types'
import type { BaseRepository } from './base.repository.ts'


export interface FindDocumentsPaginated extends Pagination {
  sortBy?: SortBy<DocumentEntity>
}


export interface CreateDocument extends Omit<
  DocumentEntity,
  'id' | 'createdAt' | 'updatedAt'
> {}


export interface UpdateDocument extends Omit<
  Partial<DocumentEntity>,
  'id' | 'createdAt' | 'updatedAt'
> {}


export interface DocumentRepository extends BaseRepository {
  findById(
    id: DocumentId
  ): Promise<DocumentEntity | null>

  findPaginated(
    options: FindDocumentsPaginated,
  ): Promise<Paginated<DocumentEntity>>

  createDocument(
    data: CreateDocument
  ): Promise<DocumentEntity>

  updateDocument(
    newDocument: DocumentEntity,
  ): Promise<DocumentEntity>

  deleteByIds(
    ids: DocumentId[],
  ): Promise<void>
}

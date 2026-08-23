import type { DocumentId, PictureEntity, PictureId } from '../entities'
import type { Paginated, Pagination, SortBy } from '../types'
import type { BaseRepository } from './base.repository.ts'


export interface FindPicturesPaginated extends Pagination {
  documentId: DocumentId
  sortBy?: SortBy<PictureEntity>
}


export interface CreatePicture extends Omit<
  PictureEntity,
  'id'
> {}


export interface UpdatePicture extends Omit<
  Partial<PictureEntity>,
  'id' | 'documentId'
> {}


export interface PictureRepository extends BaseRepository {
  findById(
    id: PictureId,
  ): Promise<PictureEntity | null>

  findPaginated(
    options: FindPicturesPaginated,
  ): Promise<Paginated<PictureEntity>>

  findFileNamesByDocumentId(
    documentId: DocumentId,
  ): Promise<PictureEntity['fileName'][]>

  createPicture(
    data: CreatePicture,
  ): Promise<PictureEntity>

  createManyPictures(
    data: CreatePicture[],
  ): Promise<PictureEntity[]>

  updatePicture(
    newPicture: PictureEntity,
  ): Promise<PictureEntity>

  deleteByDocumentId(
    documentId: DocumentId,
  ): Promise<void>

  deleteByIds(
    ids: PictureId[],
  ): Promise<void>
}

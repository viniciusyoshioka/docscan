import { In } from 'typeorm'

import type { DocumentId, PictureEntity, PictureId } from '../../entities'
import type {
  CreatePicture,
  FindPicturesPaginated,
  PictureRepository,
} from '../../repositories'
import type { Paginated } from '../../types'
import { SortOrder } from '../../types'
import type { TypeOrmPictureEntity } from '../entities'
import { BaseTypeOrmRepository } from './base-typeorm.repository.ts'


export class TypeOrmPictureRepository
  extends BaseTypeOrmRepository<TypeOrmPictureEntity>
  implements PictureRepository {

  async findById(
    id: PictureId,
  ): Promise<PictureEntity | null> {
    return await this.findOne({
      where: {
        id,
      },
    })
  }

  async findPaginated(
    options: FindPicturesPaginated,
  ): Promise<Paginated<PictureEntity>> {
    const {
      documentId,
      page = 1,
      limit = 10,
      sortBy = {
        position: SortOrder.ASC,
      },
    } = options

    const offset = (page - 1) * limit

    const query = this.createQueryBuilder('pictures')
      .where('pictures.documentId = :documentId', { documentId })
      .limit(limit)
      .offset(offset)

    Object.entries(sortBy).forEach(([column, sortOrder]) => {
      query.addOrderBy(`pictures.${column}`, sortOrder)
    })

    const [data, total] = await query.getManyAndCount()

    return {
      data,
      total,
    }
  }

  async findFileNamesByDocumentId(
    documentId: DocumentId,
  ): Promise<PictureEntity['fileName'][]> {
    const pictures = await this.find({
      select: {
        fileName: true,
      },
      where: {
        documentId,
      },
    })

    return pictures.map(picture => picture.fileName)
  }

  async findFileNamesByPictureIds(
    pictureIds: PictureId[],
  ): Promise<PictureEntity['fileName'][]> {
    const pictures = await this.find({
      select: {
        fileName: true,
      },
      where: {
        id: In(pictureIds),
      },
    })

    return pictures.map(picture => picture.fileName)
  }

  async createPicture(
    data: CreatePicture,
  ): Promise<PictureEntity> {
    const pictureToCreate = this.create({
      documentId: data.documentId,
      fileName: data.fileName,
      position: data.position,
    })

    return await this.save(pictureToCreate)
  }

  async createManyPictures(
    data: CreatePicture[],
  ): Promise<PictureEntity[]> {
    return await this.save(data)
  }

  async updatePicture(
    newPicture: PictureEntity,
  ): Promise<PictureEntity> {
    return await this.save(newPicture)
  }

  async deleteByDocumentId(
    documentId: DocumentId,
  ): Promise<void> {
    await this.delete({
      documentId,
    })
  }

  async deleteByIds(
    ids: PictureId[],
  ): Promise<void> {
    if (!ids.length) {
      return
    }

    await this.delete({
      id: In(ids),
    })
  }
}

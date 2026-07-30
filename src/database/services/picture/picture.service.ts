import { merge } from 'lodash'

import type { Transaction } from '../../database'
import type { DocumentId, PictureEntity, PictureId } from '../../entities'
import type {
  CreatePicture,
  FindPicturesPaginated,
  PictureRepository,
  UpdatePicture,
} from '../../repositories'
import type { Paginated } from '../../types'
import { SortOrder } from '../../types'
import { assertPaginationIsValid } from '../../utils'


export class PictureService {


  constructor(
    private readonly pictureRepository: PictureRepository,
  ) {}


  async findPaginated(
    options: FindPicturesPaginated,
    transaction?: Transaction,
  ): Promise<Paginated<PictureEntity>> {
    if (!transaction) {
      return await this.pictureRepository.transaction(async tx => {
        return await this.findPaginated(options, tx)
      })
    }

    const {
      documentId,
      page = 1,
      limit = 10,
      sortBy = {
        position: SortOrder.ASC,
      },
    } = options

    assertPaginationIsValid({ page, limit })

    const txPictureRepository = this.pictureRepository.withinTransaction(
      transaction,
    )

    return await txPictureRepository.findPaginated({
      documentId,
      page,
      limit,
      sortBy,
    })
  }

  async create(
    data: CreatePicture,
    transaction?: Transaction,
  ): Promise<PictureEntity> {
    if (!transaction) {
      return await this.pictureRepository.transaction(async tx => {
        return await this.create(data, tx)
      })
    }

    this.assertPictureToCreateIsValid(data)

    const txPictureRepository = this.pictureRepository.withinTransaction(
      transaction,
    )

    const createdPicture = await txPictureRepository.createPicture({
      documentId: data.documentId,
      fileName: data.fileName,
      position: data.position,
    })

    return createdPicture
  }

  private assertPictureToCreateIsValid(
    data: CreatePicture,
  ): void {
    const { fileName, position } = data

    if (!fileName.length) {
      throw new Error('Picture fileName cannot be empty')
    }

    if (position <= 0) {
      throw new Error('Picture position must be equal or greater than 1')
    }
  }

  async update(
    id: PictureId,
    newData: UpdatePicture,
    transaction?: Transaction,
  ): Promise<PictureEntity> {
    if (!transaction) {
      return await this.pictureRepository.transaction(async tx => {
        return await this.update(id, newData, tx)
      })
    }

    const txPictureRepository = this.pictureRepository.withinTransaction(
      transaction,
    )

    const existingPicture = await txPictureRepository.findById(id)
    if (!existingPicture) {
      throw new Error(`Picture (id: ${id}) was not found`)
    }

    const pictureToUpdate = merge(
      existingPicture,
      newData,
    )

    this.assertPictureToUpdateIsValid(existingPicture, pictureToUpdate)

    const updatedPicture = await txPictureRepository.updatePicture(
      pictureToUpdate,
    )

    return updatedPicture
  }

  private assertPictureToUpdateIsValid(
    existingPicture: PictureEntity,
    pictureToUpdate: PictureEntity,
  ): void {
    const { documentId, fileName, position } = pictureToUpdate

    if (!fileName.length) {
      throw new Error('Picture fileName cannot be empty')
    }

    if (position <= 0) {
      throw new Error('Picture position must be equal or greater than 1')
    }

    if (existingPicture.documentId !== documentId) {
      throw new Error('Cannot change documentId of a Picture')
    }
  }

  async deleteByDocumentId(
    documentId: DocumentId,
    transaction?: Transaction,
  ): Promise<void> {
    if (!transaction) {
      await this.pictureRepository.transaction(async tx => {
        await this.deleteByDocumentId(documentId, tx)
      })
      return
    }

    const txPictureRepository = this.pictureRepository.withinTransaction(
      transaction,
    )

    await txPictureRepository.deleteByDocumentId(documentId)
  }

  async deleteByIds(
    ids: PictureId[],
    transaction?: Transaction,
  ): Promise<void> {
    if (!ids.length) {
      return
    }

    if (!transaction) {
      await this.pictureRepository.transaction(async tx => {
        await this.deleteByIds(ids, tx)
      })
      return
    }

    const txPictureRepository = this.pictureRepository.withinTransaction(
      transaction,
    )

    await txPictureRepository.deleteByIds(ids)
  }
}

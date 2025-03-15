import { EntityManager, In, Repository } from "typeorm"

import { EntityNotFoundError } from "../../errors"
import { EntityId } from "../../types"
import { CreatePictureBO, GetPicturesByDocumentIdPaginatedBO } from "./bo"
import { PictureDTO } from "./dto"
import { PictureEntity } from "./picture.entity"


export interface PictureRepository {
  transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T>
  findByDocumentIdPaginated(params: GetPicturesByDocumentIdPaginatedBO): Promise<PictureDTO[]>
  getFileNamesByDocumentIds(documentIds: EntityId[]): Promise<string[]>
  createPicture(createBo: CreatePictureBO): Promise<PictureEntity>
  updateFileName(id: EntityId, fileName: string): Promise<PictureEntity>
  deleteByDocumentIds(documentIds: EntityId[]): Promise<void>
}


type CustomPictureRepository = ThisType<Repository<PictureEntity>> & PictureRepository


export const customPictureRepository: CustomPictureRepository = {


  async transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.manager.transaction(query)
  },


  async findByDocumentIdPaginated(
    params: GetPicturesByDocumentIdPaginatedBO,
  ): Promise<PictureDTO[]> {
    const { documentId, limit = 10, offset = 0 } = params

    return await this.find({
      where: {
        documentId,
      },
      order: {
        position: "ASC",
      },
      take: limit,
      skip: offset,
    })
  },

  async getFileNamesByDocumentIds(documentIds: EntityId[]): Promise<string[]> {
    const pictures = await this.createQueryBuilder("pictures")
      .select("file_name")
      .where("document_id IN (:...documentIds)", { documentIds })
      .getRawMany<{ file_name: string }>()

    return pictures.map(picture => picture.file_name)
  },

  async createPicture(createBo: CreatePictureBO): Promise<PictureEntity> {
    return await this.save(createBo)
  },

  async updateFileName(id: EntityId, fileName: string): Promise<PictureEntity> {
    const existingPicture = await this.findOne({
      where: { id },
    })
    if (!existingPicture) {
      throw new EntityNotFoundError(`Picture not found with id: ${id}`)
    }

    existingPicture.fileName = fileName

    return await this.save(existingPicture)
  },

  async deleteByDocumentIds(documentIds: EntityId[]): Promise<void> {
    await this.delete({
      documentId: In(documentIds),
    })
  },
}

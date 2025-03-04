import { EntityManager, Repository } from "typeorm"

import { EntityNotFoundError } from "../../errors"
import { EntityId } from "../../types"
import { CreatePictureBO } from "./bo"
import { PictureEntity } from "./picture.entity"


export interface PictureRepository {
  transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T>
  createPicture(createBo: CreatePictureBO): Promise<PictureEntity>
  updateFileName(id: EntityId, fileName: string): Promise<PictureEntity>
}


type CustomPictureRepository = ThisType<Repository<PictureEntity>> & PictureRepository


export const customPictureRepository: CustomPictureRepository = {


  async transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.manager.transaction(query)
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
}

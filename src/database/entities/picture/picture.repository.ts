import { EntityManager, Repository } from "typeorm"

import { CreatePictureBO } from "./bo"
import { PictureEntity } from "./picture.entity"


export interface PictureRepository {
  transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T>
  createPicture(createBo: CreatePictureBO): Promise<PictureEntity>
}


type CustomPictureRepository = ThisType<Repository<PictureEntity>> & PictureRepository


export const customPictureRepository: CustomPictureRepository = {


  async transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.manager.transaction(query)
  },


  async createPicture(createBo: CreatePictureBO): Promise<PictureEntity> {
    return await this.save(createBo)
  },
}

import { EntityManager, Repository } from "typeorm"

import { PictureEntity } from "./picture.entity"


export interface PictureRepository {
  transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T>
}


type CustomPictureRepository = ThisType<Repository<PictureEntity>> & PictureRepository


export const customPictureRepository: CustomPictureRepository = {


  async transaction<T = unknown>(query: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.manager.transaction(query)
  },


}

import { EntityManager } from "typeorm"

import { PictureRepository } from "./picture.repository"


export class PictureModel {
  constructor(private readonly pictureRepository: PictureRepository) {}


  async transaction<T = unknown>(tx: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.pictureRepository.transaction(tx)
  }


}

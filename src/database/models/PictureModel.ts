import { Document, Picture } from "../entities"
import { PictureRepository } from "../repositories"
import { IdOf, QueryOptions, WithId } from "../types"
import { IPictureModel } from "./interface"


// TODO implement pagination for selectAllForDocument
export class PictureModel implements IPictureModel {


  protected pictureRepository: PictureRepository


  constructor(pictureRepository: PictureRepository) {
    this.pictureRepository = pictureRepository
  }


  async select(id: IdOf<Picture>): Promise<WithId<Picture>> {
    return await this.pictureRepository.select(id)
  }

  async selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<Picture>
  ): Promise<WithId<Picture>[]> {
    return await this.pictureRepository.selectAllForDocument(documentId, options)
  }


  async insert(picture: Picture): Promise<WithId<Picture>> {
    return await this.pictureRepository.insert(picture)
  }

  async insertMultiple(pictures: Picture[]): Promise<WithId<Picture>[]> {
    const newPictures: WithId<Picture>[] = []

    for (const picture of pictures) {
      const newPicture = await this.insert(picture)
      newPictures.push(newPicture)
    }

    return newPictures
  }


  async update(picture: WithId<Picture>): Promise<WithId<Picture>> {
    return await this.pictureRepository.update(picture)
  }


  async delete(id: IdOf<Picture>): Promise<void> {
    await this.pictureRepository.delete(id)
  }

  async deleteMultiple(ids: IdOf<Picture>[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id)
    }
  }
}

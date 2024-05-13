import { Document, Picture } from "../entities"
import { PictureRepository } from "../repositories"
import { IdOf, QueryOptions, WithId } from "../types"
import { IPictureModel } from "./interface"


// TODO implement pagination for selectAllForDocument
export class PictureModel implements IPictureModel {


  private pictureRepository: PictureRepository


  constructor(pictureRepository: PictureRepository) {
    this.pictureRepository = pictureRepository
  }


  public async select(id: IdOf<Picture>): Promise<WithId<Picture>> {
    return await this.pictureRepository.select(id)
  }

  public async selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<Picture>
  ): Promise<WithId<Picture>[]> {
    return await this.pictureRepository.selectAllForDocument(documentId, options)
  }


  public async insert(picture: Picture): Promise<WithId<Picture>> {
    return await this.pictureRepository.insert(picture)
  }

  public async insertMultiple(pictures: Picture[]): Promise<WithId<Picture>[]> {
    const newPictures: WithId<Picture>[] = []

    for (const picture of pictures) {
      const newPicture = await this.insert(picture)
      newPictures.push(newPicture)
    }

    return newPictures
  }


  public async update(picture: WithId<Picture>): Promise<WithId<Picture>> {
    return await this.pictureRepository.update(picture)
  }


  public async delete(id: IdOf<Picture>): Promise<void> {
    await this.pictureRepository.delete(id)
  }

  public async deleteMultiple(ids: IdOf<Picture>[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id)
    }
  }
}

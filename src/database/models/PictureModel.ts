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


  public select(id: IdOf<Picture>): WithId<Picture> {
    return this.pictureRepository.select(id)
  }

  public selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<Picture>
  ): WithId<Picture>[]> {
    return this.pictureRepository.selectAllForDocument(documentId, options)
  }


  public insert(picture: Picture): WithId<Picture> {
    return this.pictureRepository.insert(picture)
  }

  public insertMultiple(pictures: Picture[]): WithId<Picture>[] {
    const newPictures: WithId<Picture>[] = []

    for (const picture of pictures) {
      const newPicture = this.insert(picture)
      newPictures.push(newPicture)
    }

    return newPictures
  }


  public update(picture: WithId<Picture>): WithId<Picture> {
    return this.pictureRepository.update(picture)
  }


  public delete(id: IdOf<Picture>): void {
    this.pictureRepository.delete(id)
  }

  public deleteMultiple(ids: IdOf<Picture>[]): void {
    for (const id of ids) {
      this.delete(id)
    }
  }
}

import { Document, DocumentPicture } from "../entities"
import { IDocumentPictureRepository } from "../repositories"
import { IdOf, QueryOptions, WithId } from "../types"
import { IDocumentPictureModel } from "./interface"


// TODO implement pagination for selectAllForDocument
export class DocumentPictureModel implements IDocumentPictureModel {


  private documentPictureRepository: IDocumentPictureRepository


  constructor(documentPictureRepository: IDocumentPictureRepository) {
    this.documentPictureRepository = documentPictureRepository
  }


  public select(id: IdOf<DocumentPicture>): WithId<DocumentPicture> {
    return this.documentPictureRepository.select(id)
  }

  public selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<DocumentPicture>
  ): WithId<DocumentPicture>[] {
    return this.documentPictureRepository.selectAllForDocument(documentId, options)
  }


  public insert(picture: DocumentPicture): WithId<DocumentPicture> {
    return this.documentPictureRepository.insert(picture)
  }

  public insertMultiple(pictures: DocumentPicture[]): WithId<DocumentPicture>[] {
    const newPictures: WithId<DocumentPicture>[] = []

    for (const picture of pictures) {
      const newPicture = this.insert(picture)
      newPictures.push(newPicture)
    }

    return newPictures
  }


  public update(picture: WithId<DocumentPicture>): WithId<DocumentPicture> {
    return this.documentPictureRepository.update(picture)
  }


  public delete(id: IdOf<DocumentPicture>): void {
    this.documentPictureRepository.delete(id)
  }

  public deleteMultiple(ids: IdOf<DocumentPicture>[]): void {
    for (const id of ids) {
      this.delete(id)
    }
  }
}

import { Document } from "../entities"
import { IDocumentRepository } from "../repositories"
import { IdOf, QueryOptions, WithId } from "../types"
import { IDocumentModel } from "./interface"


// TODO implement pagination for selectAll
// TODO delete all pictures associated with a document when deleting a document
export class DocumentModel implements IDocumentModel {


  private documentRepository: IDocumentRepository


  constructor(documentRepository: IDocumentRepository) {
    this.documentRepository = documentRepository
  }


  public select(id: IdOf<Document>): WithId<Document> {
    return this.documentRepository.select(id)
  }

  public selectAll(options?: QueryOptions<Document>): WithId<Document>[] {
    return this.documentRepository.selectAll(options)
  }

  public insert(document: Document): WithId<Document> {
    return this.documentRepository.insert(document)
  }

  public update(document: WithId<Document>): WithId<Document> {
    return this.documentRepository.update(document)
  }

  public delete(id: IdOf<Document>): void {
    this.documentRepository.delete(id)
  }

  public deleteMultiple(ids: IdOf<Document>[]): void {
    for (const id of ids) {
      this.delete(id)
    }
  }
}

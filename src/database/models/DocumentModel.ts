import { Document } from "../entities"
import { DocumentRepository } from "../repositories"
import { IdOf, QueryOptions, WithId } from "../types"
import { IDocumentModel } from "./interface"


// TODO implement pagination for selectAll
// TODO delete all pictures associated with a document when deleting a document
export class DocumentModel implements IDocumentModel {


  private documentRepository: DocumentRepository


  constructor(documentRepository: DocumentRepository) {
    this.documentRepository = documentRepository
  }


  public async select(id: IdOf<Document>): Promise<WithId<Document>> {
    return await this.documentRepository.select(id)
  }

  public async selectAll(options?: QueryOptions<Document>): Promise<WithId<Document>[]> {
    return await this.documentRepository.selectAll(options)
  }

  public async insert(document: Document): Promise<WithId<Document>> {
    return await this.documentRepository.insert(document)
  }

  public async update(document: WithId<Document>): Promise<WithId<Document>> {
    return await this.documentRepository.update(document)
  }

  public async delete(id: IdOf<Document>): Promise<void> {
    await this.documentRepository.delete(id)
  }

  public async deleteMultiple(ids: IdOf<Document>[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id)
    }
  }
}

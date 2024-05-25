import { Document } from "../entities"
import { DocumentRepository } from "../repositories"
import { IdOf, QueryOptions, WithId } from "../types"
import { IDocumentModel } from "./interface"


// TODO implement pagination for selectAll
// TODO delete all pictures associated with a document when deleting a document
export class DocumentModel implements IDocumentModel {


  protected documentRepository: DocumentRepository


  constructor(documentRepository: DocumentRepository) {
    this.documentRepository = documentRepository
  }


  async select(id: IdOf<Document>): Promise<WithId<Document>> {
    return await this.documentRepository.select(id)
  }

  async selectAll(options?: QueryOptions<Document>): Promise<WithId<Document>[]> {
    return await this.documentRepository.selectAll(options)
  }

  async insert(document: Document): Promise<WithId<Document>> {
    return await this.documentRepository.insert(document)
  }

  async update(document: WithId<Document>): Promise<WithId<Document>> {
    return await this.documentRepository.update(document)
  }

  async delete(id: IdOf<Document>): Promise<void> {
    await this.documentRepository.delete(id)
  }

  async deleteMultiple(ids: IdOf<Document>[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id)
    }
  }
}

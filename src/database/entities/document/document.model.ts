import { EntityManager } from "typeorm"
import { DocumentMapper } from "./document.mapper"
import { DocumentRepository } from "./document.repository"
import { DocumentDTO, GetDocumentsPaginatedDTO } from "./dto"


export class DocumentModel {
  constructor(private readonly documentRepository: DocumentRepository) {}


  async transaction<T = unknown>(tx: (tx: EntityManager) => Promise<T>): Promise<T> {
    return await this.documentRepository.transaction(tx)
  }


  async getDocumentsPaginated(options?: GetDocumentsPaginatedDTO): Promise<DocumentDTO[]> {
    const getDocumentPaginatedBo = options
      ? DocumentMapper.fromGetDocumentsPaginatedDtoToBo(options)
      : undefined

    // TODO: Add validation

    const documents = await this.documentRepository.getDocumentsPaginated(getDocumentPaginatedBo)
    return documents.map(DocumentMapper.fromEntityToDto)
  }
}

import { EntityManager } from "typeorm"

import { EntityId } from "../../types"
import { DocumentEntity } from "./document.entity"
import { DocumentMapper } from "./document.mapper"
import { customDocumentRepository, DocumentRepository } from "./document.repository"
import { CreateDocumentDTO, DocumentDTO, GetDocumentsPaginatedDTO } from "./dto"


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

  async create(params: {
    createDto: CreateDocumentDTO
    transaction: EntityManager
  }): Promise<DocumentDTO> {
    const { createDto, transaction } = params

    const documentRepo = transaction.getRepository(DocumentEntity).extend(customDocumentRepository)
    const createBo = DocumentMapper.fromCreateDtoToCreateBo(createDto)

    // TODO: Add validation

    const document = await documentRepo.createDocument(createBo)
    return DocumentMapper.fromEntityToDto(document)
  }

  async updateDocumentLastUpdateDate(
    id: EntityId,
    transaction: EntityManager,
  ): Promise<DocumentDTO> {
    const documentRepo = transaction.getRepository(DocumentEntity).extend(customDocumentRepository)

    const updatedDocument = await documentRepo.updateDocumentLastUpdateDate(id)
    return DocumentMapper.fromEntityToDto(updatedDocument)
  }

  async updateDocumentName(id: EntityId, newName: string): Promise<DocumentDTO> {
    const updatedDocument = await this.documentRepository.updateDocumentName(id, newName)
    return DocumentMapper.fromEntityToDto(updatedDocument)
  }

  async deleteByIds(ids: EntityId[], transaction: EntityManager): Promise<void> {
    const documentRepo = transaction.getRepository(DocumentEntity).extend(customDocumentRepository)
    await documentRepo.deleteByIds(ids)
  }
}

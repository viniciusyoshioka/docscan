import { CreateDocumentBO, GetDocumentsPaginatedBO } from "./bo"
import { DocumentEntity } from "./document.entity"
import { CreateDocumentDTO, DocumentDTO, GetDocumentsPaginatedDTO } from "./dto"


export class DocumentMapper {
  static fromEntityToDto(entity: DocumentEntity): DocumentDTO {
    const dto = new DocumentDTO()
    dto.id = entity.id
    dto.name = entity.name
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }

  static fromGetDocumentsPaginatedDtoToBo(dto: GetDocumentsPaginatedDTO): GetDocumentsPaginatedBO {
    const bo = new GetDocumentsPaginatedBO()
    bo.limit = dto.limit
    bo.offset = dto.offset
    return bo
  }

  static fromCreateDtoToCreateBo(dto: CreateDocumentDTO): CreateDocumentBO {
    const bo = new CreateDocumentBO()
    bo.name = dto.name
    return bo
  }
}

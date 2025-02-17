import { DocumentEntity } from "./document.entity"
import { DocumentDTO } from "./dto"


export class DocumentMapper {
  static fromEntityToDto(entity: DocumentEntity): DocumentDTO {
    const dto = new DocumentDTO()
    dto.id = entity.id
    dto.name = entity.name
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }
}

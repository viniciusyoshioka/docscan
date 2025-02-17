import { PictureDTO } from "./dto"
import { PictureEntity } from "./picture.entity"


export class PictureMapper {
  static fromEntityToDto(entity: PictureEntity): PictureDTO {
    const dto = new PictureDTO()
    dto.id = entity.id
    dto.fileName = entity.fileName
    dto.position = entity.position
    dto.documentId = entity.documentId
    return dto
  }
}

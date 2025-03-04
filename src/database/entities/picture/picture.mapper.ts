import { CreatePictureBO } from "./bo"
import { CreatePictureDTO, PictureDTO } from "./dto"
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

  static fromCreateDtoToCreateBo(dto: CreatePictureDTO): CreatePictureBO {
    const bo = new CreatePictureBO()
    bo.fileName = dto.fileName
    bo.position = dto.position
    bo.documentId = dto.documentId
    return bo
  }
}

import { CreateLogBO } from "./bo"
import { CreateLogDTO, LogDTO } from "./dto"
import { LogEntity } from "./log.entity"


export class LogMapper {
  static fromEntityToDto(entity: LogEntity): LogDTO {
    const dto = new LogDTO()
    dto.id = entity.id
    dto.code = entity.code
    dto.message = entity.message
    dto.timestamp = entity.timestamp
    return dto
  }

  static fromCreateDtoToCreateBo(dto: CreateLogDTO): CreateLogBO {
    const bo = new CreateLogBO()
    bo.code = dto.code
    bo.message = dto.message
    return bo
  }
}

import { CreateLogDTO, LogDTO } from "./dto"
import { LogMapper } from "./log.mapper"
import { LogRepository } from "./log.repository"


export class LogModel {
  constructor(private readonly logRepository: LogRepository) {}


  async create(createDto: CreateLogDTO): Promise<LogDTO> {
    const createBo = LogMapper.fromCreateDtoToCreateBo(createDto)

    // TODO: Add validation

    const createdEntity = await this.logRepository.create(createBo)
    return LogMapper.fromEntityToDto(createdEntity)
  }
}

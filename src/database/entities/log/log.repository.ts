import { Repository } from "typeorm"

import { CreateLogBO } from "./bo"
import { LogEntity } from "./log.entity"


export interface LogRepository {
  create(createBo: CreateLogBO): Promise<LogEntity>
}


type CustomLogRepository = ThisType<Repository<LogEntity>> & LogRepository


export const customLogRepository: CustomLogRepository = {
  async create(createBo: CreateLogBO): Promise<LogEntity> {
    return await this.save(createBo)
  },
}

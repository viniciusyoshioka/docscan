import type { CreateLog, LogRepository } from '../../repositories'
import type { TypeOrmLogEntity } from '../entities'
import { BaseTypeOrmRepository } from './base-typeorm.repository.ts'


export class TypeOrmLogRepository
  extends BaseTypeOrmRepository<TypeOrmLogEntity>
  implements LogRepository {


  async insertLog(logToCreate: CreateLog): Promise<void> {
    const timestamp = Date.now()

    await this.insert({
      type: logToCreate.type,
      timestamp,
      message: logToCreate.message,
      stackTrace: logToCreate.stackTrace,
    })
  }
}

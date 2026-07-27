import type { SetOptional } from 'type-fest'

import type { LogEntity } from '../entities'
import type { BaseRepository } from './base.repository.ts'


export interface CreateLog extends SetOptional<
  Omit<LogEntity, 'id' | 'timestamp'>,
  'stackTrace'
> {}


export interface LogRepository extends BaseRepository {
  insertLog(logToCreate: CreateLog): Promise<void>
}

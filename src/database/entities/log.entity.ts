import type { Brand } from '../internal-types'


export type LogId = Brand<number, 'logId'>


export enum LogType {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}


export interface LogEntity {
  id: LogId
  type: LogType
  timestamp: number
  message: string
  stackTrace: string | null
}

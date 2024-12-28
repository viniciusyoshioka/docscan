import { EntityId } from "@database/types"


export enum LogCode {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
}


export interface LogEntity {
  id: EntityId
  code: LogCode
  message: string
  timestamp: number
}

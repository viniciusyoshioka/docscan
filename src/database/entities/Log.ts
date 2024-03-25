export enum LogCode {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
}


export interface LogWithoutId {
  code: LogCode
  message: string
  timestamp?: number
}

export interface LogWithId extends LogWithoutId {
  id: string
}

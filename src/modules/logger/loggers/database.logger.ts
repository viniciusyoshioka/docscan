import type { LogService } from '@database'
import { LogType } from '@database'
import { stringifyError } from '@utils'
import { UnknownLogError } from '../errors'
import type { Logger } from '../logger.interface.ts'


export class DatabaseLogger implements Logger {


  private readonly logService: LogService


  constructor(logService: LogService) {
    this.logService = logService
  }


  private async insertLog(params: {
    logType: LogType
    message: string
    stackTrace?: string
  }): Promise<void> {
    const { logType, message, stackTrace } = params

    try {
      await this.logService.create({ logType, message, stackTrace })
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownLogError(errorMessage)
    }
  }


  async debug(message: string, stackTrace?: string): Promise<void> {
    const logType = LogType.DEBUG

    await this.insertLog({
      logType,
      message,
      stackTrace,
    })
  }

  async info(message: string, stackTrace?: string): Promise<void> {
    const logType = LogType.INFO

    await this.insertLog({
      logType,
      message,
      stackTrace,
    })
  }

  async warn(message: string, stackTrace?: string): Promise<void> {
    const logType = LogType.WARN

    await this.insertLog({
      logType,
      message,
      stackTrace,
    })
  }

  async error(message: string, stackTrace?: string): Promise<void> {
    const logType = LogType.ERROR

    await this.insertLog({
      logType,
      message,
      stackTrace,
    })
  }
}

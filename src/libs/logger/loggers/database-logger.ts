import { LogCode, LogModel } from "@database"
import { stringifyError } from "@utils"
import { UnknownLogError } from "../errors"
import { Logger } from "../logger.interface"


export class DatabaseLogger implements Logger {


  private readonly logModel: LogModel


  constructor(logModel: LogModel) {
    this.logModel = logModel
  }


  private async insertLog(code: LogCode, message: string): Promise<void> {
    try {
      await this.logModel.create({ code, message })
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownLogError(errorMessage)
    }
  }

  async debug(message: string): Promise<void> {
    const code = LogCode.debug
    await this.insertLog(code, message)
  }

  async info(message: string): Promise<void> {
    const code = LogCode.info
    await this.insertLog(code, message)
  }

  async warn(message: string): Promise<void> {
    const code = LogCode.warn
    await this.insertLog(code, message)
  }

  async error(message: string): Promise<void> {
    const code = LogCode.error
    await this.insertLog(code, message)
  }
}

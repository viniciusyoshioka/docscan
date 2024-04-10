import { ILogModel, LogCode } from "@database"
import { stringifyError } from "@utils"
import { UnknowLogError } from "../errors"
import { ILogger } from "../interfaces"


export class DatabaseLogger implements ILogger {


  private logModel: ILogModel


  constructor(logModel: ILogModel) {
    this.logModel = logModel
  }


  public debug(message: string): void {
    try {
      const code = LogCode.debug
      this.logModel.insert({ code, message })
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
  }

  public info(message: string): void {
    try {
      const code = LogCode.info
      this.logModel.insert({ code, message })
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
  }

  public warn(message: string): void {
    try {
      const code = LogCode.warn
      this.logModel.insert({ code, message })
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
  }

  public error(message: string): void {
    try {
      const code = LogCode.error
      this.logModel.insert({ code, message })
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
  }
}

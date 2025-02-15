import Realm from "realm"

import { LogCode, LogSchema } from "@database"
import { stringifyError } from "@utils"
import { UnknownLogError } from "../errors"
import { Logger } from "../interfaces"


export class DatabaseLogger implements Logger {


  private readonly logDatabase: Realm


  constructor(logDatabase: Realm) {
    this.logDatabase = logDatabase
  }


  private async insertLog(code: LogCode, message: string): Promise<void> {
    try {
      this.logDatabase.write(() => {
        this.logDatabase.create(LogSchema, { code, message })
      })
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

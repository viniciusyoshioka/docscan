import { SetOptional } from "type-fest"

import { Log } from "../entities"
import { LogRepository } from "../repositories"
import { WithId } from "../types"
import { ILogModel } from "./interface"


export class LogModel implements ILogModel {


  private logRepository: LogRepository


  constructor(logRepository: LogRepository) {
    this.logRepository = logRepository
  }


  async insert(log: SetOptional<Log, "timestamp">): Promise<WithId<Log>> {
    const newLog: Log = {
      ...log,
      timestamp: Date.now(),
    }

    return await this.logRepository.insert(newLog)
  }
}

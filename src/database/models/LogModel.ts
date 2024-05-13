import { Log } from "../entities"
import { LogRepository } from "../repositories"
import { WithId } from "../types"
import { ILogModel } from "./interface"


export class LogModel implements ILogModel {


  private logRepository: LogRepository


  constructor(logRepository: LogRepository) {
    this.logRepository = logRepository
  }


  public async insert(log: Log): Promise<WithId<Log>> {
    return await this.logRepository.insert(log)
  }
}

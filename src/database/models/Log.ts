import { Log } from "../entities"
import { LogRepository } from "../repositories"
import { WithId } from "../types"
import { ILogModel } from "./interface"


export class LogModel implements ILogModel {


  private logRepository: LogRepository


  constructor(logRepository: LogRepository) {
    this.logRepository = logRepository
  }


  public insert(log: Log): WithId<Log> {
    return this.logRepository.insert(log)
  }
}

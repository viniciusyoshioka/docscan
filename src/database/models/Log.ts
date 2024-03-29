import { Log } from "../entities"
import { ILogRepository } from "../repositories"
import { WithId } from "../types"
import { ILogModel } from "./interface"


export class LogModel implements ILogModel {


  private logRepository: ILogRepository


  constructor(logRepository: ILogRepository) {
    this.logRepository = logRepository
  }


  public insert(log: Log): WithId<Log> {
    return this.logRepository.insert(log)
  }
}

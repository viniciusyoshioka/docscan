import { Log } from "../../entities"


export interface ILogRepository {
  insert: (log: Log) => void
}

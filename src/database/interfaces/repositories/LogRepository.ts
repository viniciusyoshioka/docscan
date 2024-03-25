import { LogWithId, LogWithoutId } from "../../entities"


export interface ILogRepository {
  insert: (log: LogWithoutId) => LogWithId
}

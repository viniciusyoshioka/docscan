import { Log } from "../../entities"
import { WithId } from "../../types"


export interface ILogRepository {
  insert: (log: Log) => WithId<Log>
}

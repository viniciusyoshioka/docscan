import { Log } from "../../entities"
import { WithId } from "../../types"


export interface ILogModel {
  insert(log: Log): WithId<Log>
}

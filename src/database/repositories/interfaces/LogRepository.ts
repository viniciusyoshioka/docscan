import { Log } from "../../entities"
import { WithId } from "../../types"


export interface LogRepository {
  insert(log: Log): Promise<WithId<Log>>
}

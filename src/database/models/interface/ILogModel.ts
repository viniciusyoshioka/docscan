import { SetOptional } from "type-fest"

import { Log } from "../../entities"
import { WithId } from "../../types"


export interface ILogModel {
  insert(log: SetOptional<Log, "timestamp">): Promise<WithId<Log>>
}

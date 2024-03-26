import { Log } from "../entities"
import { LogRealmSchema } from "../schemas"
import { WithId } from "../types"


export class LogMapper {

  static fromRealm(log: LogRealmSchema): WithId<Log> {
    const object = log.toJSON() as unknown as WithId<Log>
    object.id = log.id.toHexString()
    return object
  }
}

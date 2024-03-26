import { LogWithId } from "../entities"
import { LogRealmSchema } from "../schemas"


export class LogMapper {
  static fromRealm(log: LogRealmSchema): LogWithId {
    const object = log.toJSON() as unknown as LogWithId
    object.id = log.id.toHexString()
    return object
  }
}

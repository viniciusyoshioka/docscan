import { Realm } from "realm"

import { Log } from "../entities"
import { LogRealmSchema } from "../schemas"
import { WithId } from "../types"
import { stringifyError } from "../utils"
import { UnknownDatabaseError } from "./errors"
import { ILogRepository } from "./interfaces"


export class RealmLogRepository implements ILogRepository {


  private realm: Realm


  constructor(realm: Realm) {
    this.realm = realm
  }


  public insert(log: Log): WithId<Log> {
    try {
      const newLog = this.realm.write(() => {
        return this.realm.create(LogRealmSchema, log)
      })

      return this.toJson(newLog)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }


  private toJson(log: LogRealmSchema): WithId<Log> {
    const object = log.toJSON() as unknown as WithId<Log>
    object.id = log.id.toHexString()
    return object
  }
}

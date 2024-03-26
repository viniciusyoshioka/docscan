import { Realm } from "realm"

import { LogWithId, LogWithoutId } from "../entities"
import { LogMapper } from "../mappers"
import { LogRealmSchema } from "../schemas"
import { ILogRepository } from "./interfaces"


export class RealmLogRepository implements ILogRepository {


  private realm: Realm


  constructor(realm: Realm) {
    this.realm = realm
  }


  public insert(log: LogWithoutId): LogWithId {
    const newLog = this.realm.write(() => {
      return this.realm.create(LogRealmSchema, log)
    })

    return LogMapper.fromRealm(newLog)
  }
}

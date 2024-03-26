import { Realm } from "realm"

import { Log } from "../entities"
import { LogMapper } from "../mappers"
import { LogRealmSchema } from "../schemas"
import { WithId } from "../types"
import { ILogRepository } from "./interfaces"


export class RealmLogRepository implements ILogRepository {


  private realm: Realm


  constructor(realm: Realm) {
    this.realm = realm
  }


  public insert(log: Log): WithId<Log> {
    const newLog = this.realm.write(() => {
      return this.realm.create(LogRealmSchema, log)
    })

    return LogMapper.fromRealm(newLog)
  }
}

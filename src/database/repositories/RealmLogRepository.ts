import { Realm } from "realm"

import { Log } from "../entities"
import { ILogRepository } from "../interfaces"
import { LogRealmSchema } from "../schemas"


export class RealmLogRepository implements ILogRepository {


  private realm: Realm


  constructor(realm: Realm) {
    this.realm = realm
  }


  public insert(log: Log) {
    this.realm.write(() => {
      this.realm.create(LogRealmSchema, log)
    })
  }
}

import { Realm } from "realm"

import { Log } from "../entities"
import { LogRealmSchema } from "../schemas"
import { ILogRepository } from "./interfaces"


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

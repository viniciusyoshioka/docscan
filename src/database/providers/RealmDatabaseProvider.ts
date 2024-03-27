import { Realm } from "realm"

import { IRealmDatabaseProvider } from "./interfaces"


export class RealmDatabaseProvider implements IRealmDatabaseProvider {


  private database: Realm


  constructor(database: Realm) {
    this.database = database
  }


  getDatabase(): Realm {
    return this.database
  }
}

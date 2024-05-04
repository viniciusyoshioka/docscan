import { Realm } from "realm"


export interface IRealmDatabaseProvider {
  getDatabase(): Realm
}

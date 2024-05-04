import { Realm } from "@realm/react"


export class LogRealmSchema extends Realm.Object {
  id = new Realm.BSON.ObjectId()
  code!: number
  message!: string
  timestamp: number = Date.now()

  static primaryKey = "id"
}

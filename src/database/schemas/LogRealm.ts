import { Realm } from "@realm/react"

import { ILogRealmSchema } from "../interfaces"


export class LogRealmSchema extends Realm.Object implements ILogRealmSchema {
  id = new Realm.BSON.ObjectId()
  code!: string
  message!: string
  timestamp: number = Date.now()

  static primaryKey = "id"
}

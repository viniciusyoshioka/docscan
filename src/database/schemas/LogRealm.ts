import { Realm } from "@realm/react"

import { ILogRealmSchema } from "../interfaces"


export class LogSchema extends Realm.Object<LogSchema> implements ILogRealmSchema {
  id = new Realm.BSON.ObjectId()
  code!: string
  message!: string
  timestamp: number = Date.now()

  static primaryKey = "id"
}

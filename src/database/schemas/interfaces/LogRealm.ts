import { Realm } from "@realm/react"

import { LogCode } from "../../entities"


export interface ILogRealmSchema {
  id: Realm.BSON.ObjectId
  code: LogCode
  message: string
  timestamp: number
}

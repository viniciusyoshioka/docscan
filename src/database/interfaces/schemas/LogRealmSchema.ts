import { Realm } from "@realm/react"


export interface ILogRealmSchema {
  id: Realm.BSON.ObjectId
  code: string
  message: string
  timestamp: number
}

import { Realm } from "@realm/react"


export interface LogRealm {
  id: Realm.BSON.ObjectId
  code: number
  message: string
  timestamp: number
}

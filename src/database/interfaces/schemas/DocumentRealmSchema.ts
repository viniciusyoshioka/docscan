import { Realm } from "@realm/react"


export interface IDocumentRealmSchema {
  id: Realm.BSON.ObjectId
  createdAt: number
  modifiedAt: number
  name: string
}

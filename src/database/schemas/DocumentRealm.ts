import { Realm } from "@realm/react"

import { IDocumentRealmSchema } from "./interfaces"


export class DocumentRealmSchema
  extends Realm.Object implements IDocumentRealmSchema {

  id = new Realm.BSON.ObjectId()
  createdAt: number = Date.now()
  modifiedAt: number = Date.now()
  name!: string

  static primaryKey = "id"
}

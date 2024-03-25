import { Realm } from "@realm/react"

import { IDocumentRealmSchema } from "../interfaces"


export class DocumentSchema
  extends Realm.Object<DocumentSchema> implements IDocumentRealmSchema {

  id = new Realm.BSON.ObjectId()
  createdAt: number = Date.now()
  modifiedAt: number = Date.now()
  name!: string

  static primaryKey = "id"
}

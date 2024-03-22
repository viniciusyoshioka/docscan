import { Realm } from "@realm/react"

import { DocumentRealm } from "../interfaces"


export class DocumentSchema
  extends Realm.Object<DocumentSchema>
  implements DocumentRealm {

  id = new Realm.BSON.ObjectId()
  createdAt: number = Date.now()
  modifiedAt: number = Date.now()
  name!: string

  static primaryKey = "id"
}

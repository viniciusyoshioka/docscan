import { Realm } from "@realm/react"


export class DocumentRealmSchema extends Realm.Object {
  id = new Realm.BSON.ObjectId()
  createdAt: number = Date.now()
  modifiedAt: number = Date.now()
  name!: string

  static primaryKey = "id"
}

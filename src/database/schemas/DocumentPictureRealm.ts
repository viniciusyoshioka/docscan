import { Realm } from "@realm/react"


export class DocumentPictureRealmSchema extends Realm.Object {
  id = new Realm.BSON.ObjectId()
  fileName!: string
  position!: number
  belongsTo!: Realm.BSON.ObjectId

  static primaryKey = "id"
}

import { Realm } from "@realm/react"

import { IDocumentPictureRealmSchema } from "./interfaces"


export class DocumentPictureRealmSchema
  extends Realm.Object implements IDocumentPictureRealmSchema {

  id = new Realm.BSON.ObjectId()
  fileName!: string
  position!: number
  belongsTo!: Realm.BSON.ObjectId

  static primaryKey = "id"
}

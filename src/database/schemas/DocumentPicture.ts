import { Realm } from "@realm/react"

import { IDocumentPictureRealmSchema } from "../interfaces"


export class DocumentPictureSchema
  extends Realm.Object<DocumentPictureSchema> implements IDocumentPictureRealmSchema {

  id = new Realm.BSON.ObjectId()
  fileName!: string
  position!: number
  belongsToDocument!: Realm.BSON.ObjectId

  static primaryKey = "id"
}

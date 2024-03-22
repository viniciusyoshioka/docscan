import { Realm } from "@realm/react"

import { DocumentPictureRealm } from "../interfaces"


export class DocumentPictureSchema
  extends Realm.Object<DocumentPictureSchema>
  implements DocumentPictureRealm {

  id = new Realm.BSON.ObjectId()
  fileName!: string
  position!: number
  belongsToDocument!: Realm.BSON.ObjectId

  static primaryKey = "id"
}
